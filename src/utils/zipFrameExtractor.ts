// High-performance browser-native ZIP & multi-image frame sequence extractor
// Supports lazy Blob extraction for GPU LRU caching as well as direct ImageBitmap decoding.

const naturalCompare = (a: string, b: string): number => {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

const isImageFileName = (name: string): boolean => {
  const lower = name.toLowerCase();
  if (lower.includes('__macosx') || lower.split('/').pop()?.startsWith('.')) {
    return false;
  }
  return (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp')
  );
};

const getMimeType = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
};

const inflateRaw = async (compressed: Uint8Array): Promise<Uint8Array> => {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('DecompressionStream not supported');
  }
  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(compressed as unknown as BufferSource);
  writer.close();

  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLen = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      totalLen += value.byteLength;
    }
  }

  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
};

/**
 * Extracts compressed JPG/PNG/WebP frame Blobs from a .zip archive in chronological order
 * without decoding all frames into GPU memory at once, enabling O(1) GPU LRU caching.
 */
export const extractFrameBlobsFromZip = async (
  zipBlob: Blob,
  onProgress?: (pct: number) => void,
  isCancelled?: () => boolean
): Promise<Blob[]> => {
  const buffer = await zipBlob.arrayBuffer();
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // Locate End of Central Directory (EOCD) signature 0x06054b50
  let eocdOffset = -1;
  const minEocdOffset = Math.max(0, buffer.byteLength - 65557);
  for (let i = buffer.byteLength - 22; i >= minEocdOffset; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Invalid ZIP archive: EOCD not found');
  }

  const totalEntries = view.getUint16(eocdOffset + 10, true);
  const cdOffset = view.getUint32(eocdOffset + 16, true);

  interface ZipEntryMeta {
    name: string;
    compressionMethod: number;
    compressedSize: number;
    uncompressedSize: number;
    localHeaderOffset: number;
  }

  const entries: ZipEntryMeta[] = [];
  let ptr = cdOffset;
  const decoder = new TextDecoder('utf-8');

  for (let i = 0; i < totalEntries && ptr + 46 <= buffer.byteLength; i++) {
    const sig = view.getUint32(ptr, true);
    if (sig !== 0x02014b50) break;

    const compressionMethod = view.getUint16(ptr + 10, true);
    const compressedSize = view.getUint32(ptr + 20, true);
    const uncompressedSize = view.getUint32(ptr + 24, true);
    const fileNameLen = view.getUint16(ptr + 28, true);
    const extraLen = view.getUint16(ptr + 30, true);
    const commentLen = view.getUint16(ptr + 32, true);
    const localHeaderOffset = view.getUint32(ptr + 42, true);

    const nameBytes = bytes.subarray(ptr + 46, ptr + 46 + fileNameLen);
    const name = decoder.decode(nameBytes);

    if (isImageFileName(name) && compressedSize > 0) {
      entries.push({
        name,
        compressionMethod,
        compressedSize,
        uncompressedSize,
        localHeaderOffset,
      });
    }

    ptr += 46 + fileNameLen + extraLen + commentLen;
  }

  // Sort strictly in chronological / natural filename order
  entries.sort((a, b) => naturalCompare(a.name, b.name));

  const frameBlobs: Blob[] = [];
  const count = entries.length;

  for (let i = 0; i < count; i++) {
    if (isCancelled?.()) {
      return [];
    }

    const entry = entries[i];
    const lhOffset = entry.localHeaderOffset;
    if (lhOffset + 30 > buffer.byteLength) continue;

    const lhSig = view.getUint32(lhOffset, true);
    if (lhSig !== 0x04034b50) continue;

    const lhNameLen = view.getUint16(lhOffset + 26, true);
    const lhExtraLen = view.getUint16(lhOffset + 28, true);
    const dataStart = lhOffset + 30 + lhNameLen + lhExtraLen;
    const dataEnd = dataStart + entry.compressedSize;

    if (dataEnd > buffer.byteLength) continue;

    const rawSlice = bytes.subarray(dataStart, dataEnd);
    let fileBytes: Uint8Array;

    if (entry.compressionMethod === 0) {
      fileBytes = rawSlice;
    } else if (entry.compressionMethod === 8) {
      fileBytes = await inflateRaw(rawSlice);
    } else {
      continue;
    }

    const imgBlob = new Blob([fileBytes as unknown as BlobPart], {
      type: getMimeType(entry.name),
    });
    frameBlobs.push(imgBlob);

    onProgress?.(Math.round(((i + 1) / count) * 100));
  }

  return frameBlobs;
};

/**
 * Sorts multiple uploaded image files (.jpg/.png/.webp) in strict chronological order
 * without decoding all of them into GPU memory upfront.
 */
export const sortImageFilesChronologically = (files: File[]): File[] => {
  return [...files]
    .filter((f) => isImageFileName(f.name) || f.type.startsWith('image/'))
    .sort((a, b) => naturalCompare(a.name, b.name));
};
