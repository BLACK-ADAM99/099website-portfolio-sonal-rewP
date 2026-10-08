import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Copy, Download, ShieldCheck, AlertTriangle, Sparkles, Award } from 'lucide-react';
import { ChecklistItem } from '../data/productionChecklistData';
import { cyberSound } from '../utils/cyberSound';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ChecklistItem[];
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ isOpen, onClose, items }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate statistics
  const totalSubtasks = items.reduce((acc, it) => acc + it.subtasks.length, 0);
  const completedSubtasks = items.reduce(
    (acc, it) => acc + it.subtasks.filter((s) => s.done).length,
    0
  );
  const percentage = Math.round((completedSubtasks / (totalSubtasks || 1)) * 100);

  const completedSections = items.filter((it) => it.subtasks.every((s) => s.done)).length;

  const criticalPending = items.flatMap((it) =>
    it.subtasks.filter((s) => s.critical && !s.done).map((s) => ({ section: it.title, text: s.text }))
  );

  const generateMarkdownReport = () => {
    return `# BRAINPLEXUS PRODUCTION READINESS AUDIT REPORT
Generated from: "FROM AI-GENERATED CODE TO PRODUCTION-READY WEBSITE"
Checklist Standard created by rishabhpratapsingh.dev

=======================================================
READINESS SCORE: ${percentage}% (${completedSubtasks}/${totalSubtasks} tasks verified)
COMPLETED SECTIONS: ${completedSections}/20
STATUS: ${percentage >= 90 ? 'READY FOR PRODUCTION TRAFFIC' : percentage >= 50 ? 'SUBSTANTIAL PROGRESS - CRITICAL GAPS REMAIN' : 'PROTOTYPE PHASE - NOT PRODUCTION READY'}
=======================================================

## CRITICAL PENDING BLOCKERS (${criticalPending.length}):
${criticalPending.length === 0 ? '- None! All critical production gates verified.' : criticalPending.map((c) => `- [ ] [${c.section}] ${c.text}`).join('\n')}

## SECTION BY SECTION BREAKDOWN:
${items
  .map((it) => {
    const sectionTasks = it.subtasks.length;
    const sectionDone = it.subtasks.filter((s) => s.done).length;
    const isFullyDone = sectionTasks === sectionDone;
    return `### ${it.number}. ${it.title} [${sectionDone}/${sectionTasks} ${isFullyDone ? 'PASSED' : 'INCOMPLETE'}]
${it.keyRule ? `> Rule: ${it.keyRule.split('\n')[0]}` : ''}
${it.subtasks.map((s) => `- [${s.done ? 'x' : ' '}] ${s.text}${s.critical ? ' (CRITICAL)' : ''}`).join('\n')}
`;
  })
  .join('\n')}

-------------------------------------------------------
"AI can generate the code. You still need engineering to make the product production-ready."
BrainPlexus • Created by rishabhpratapsingh.dev
`;
  };

  const handleCopyMarkdown = () => {
    cyberSound.playClick();
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    cyberSound.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-[#0b051f] border border-purple-500/50 shadow-[0_0_60px_rgba(217,70,239,0.35)] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-purple-900/60 bg-[#070215]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/50 flex items-center justify-center text-cyan-400">
                <Award className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold font-tech text-white uppercase tracking-wider">
                  PRODUCTION READINESS AUDIT CERTIFICATE
                </h3>
                <p className="text-xs font-mono text-purple-300">
                  BrainPlexus Standard &bull; Created by rishabhpratapsingh.dev
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                cyberSound.playClick();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
            {/* Score Banner */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-purple-950/70 to-fuchsia-950/50 border border-fuchsia-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-fuchsia-300 font-bold uppercase tracking-wider mb-1">
                  OVERALL AUDIT SCORE
                </div>
                <div className="text-3xl font-bold font-tech text-white flex items-baseline gap-2">
                  <span>{percentage}%</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">
                    ({completedSubtasks} of {totalSubtasks} tasks verified)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-lg border font-bold text-xs ${
                  percentage >= 85
                    ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                    : percentage >= 50
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-300'
                    : 'bg-red-950/80 border-red-500/80 text-red-300'
                }`}>
                  {percentage >= 85 ? '✓ PRODUCTION READY' : percentage >= 50 ? '⚠ HARDENING REQUIRED' : '✕ IN DEVELOPMENT'}
                </span>
              </div>
            </div>

            {/* Critical Blockers Alert */}
            {criticalPending.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{criticalPending.length} CRITICAL PRODUCTION BLOCKERS REMAIN:</span>
                </div>
                <ul className="space-y-1 list-disc list-inside text-slate-300 pl-2">
                  {criticalPending.slice(0, 5).map((c, i) => (
                    <li key={i}>
                      <strong className="text-amber-300">[{c.section}]</strong> {c.text}
                    </li>
                  ))}
                  {criticalPending.length > 5 && (
                    <li className="text-slate-400 italic">
                      + {criticalPending.length - 5} more critical requirements...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Raw Markdown Preview Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>EXPORTABLE MARKDOWN REPORT</span>
                <span>GITHUB / NOTION COMPATIBLE</span>
              </div>
              <div className="p-4 rounded-xl bg-black/70 border border-purple-950 text-slate-300 max-h-52 overflow-y-auto select-all">
                <pre className="whitespace-pre-wrap">{generateMarkdownReport()}</pre>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-purple-900/60 bg-[#070215] flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-purple-400">
              Share with your team, engineering manager, or client.
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(217,70,239,0.4)] cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>REPORT COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>COPY MARKDOWN REPORT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
