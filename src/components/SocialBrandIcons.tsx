import React, { useId } from 'react';

export const APURBA_SOCIAL_LINKS = {
  instagramUrl: 'https://www.instagram.com/alone_gamer1508?stkn=eHRpM2ZsaHQwMjc2',
  instagramHandle: '@alone_gamer1508',
  whatsappNumber: '7797304622',
  whatsappDisplay: '+91 7797304622',
  whatsappUrl: 'https://wa.me/917797304622',
  emailAddress: 'apurbabera45@gmail.com',
  emailUrl: 'mailto:apurbabera45@gmail.com',
} as const;

interface BrandIconProps {
  className?: string;
}

/**
 * Official WhatsApp Vector Logo (Speech Bubble + Handset)
 */
export const WhatsAppLogo: React.FC<BrandIconProps> = ({ className = 'w-4 h-4' }) => {
  const gradId = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#25D366" />
          <stop offset="100%" stopColor="#128C7E" />
        </linearGradient>
      </defs>
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.56 13.99C16.31 13.87 15.09 13.27 14.87 13.18C14.64 13.1 14.48 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 12.99 14.33C12.74 14.21 11.94 13.94 11 13.1C10.26 12.44 9.77 11.63 9.62 11.38C9.48 11.13 9.6 11 9.73 10.87C9.84 10.76 9.98 10.58 10.1 10.44C10.23 10.3 10.27 10.19 10.35 10.03C10.43 9.86 10.39 9.72 10.33 9.6C10.27 9.47 9.77 8.26 9.57 7.76C9.37 7.28 9.16 7.34 9.01 7.33C8.86 7.32 8.7 7.32 8.53 7.32C8.37 7.32 8.1 7.38 7.87 7.63C7.65 7.88 7.01 8.48 7.01 9.69C7.01 10.91 7.9 12.08 8.02 12.25C8.15 12.41 9.77 14.92 12.26 15.99C12.85 16.25 13.31 16.4 13.67 16.52C14.26 16.71 14.8 16.68 15.22 16.62C15.7 16.55 16.68 16.02 16.89 15.44C17.1 14.86 17.1 14.37 17.04 14.27C16.97 14.16 16.81 14.11 16.56 13.99Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
};

/**
 * Official Instagram Vector Logo (Rounded Camera + Multi-Stop Gradient)
 */
export const InstagramLogo: React.FC<BrandIconProps> = ({ className = 'w-4 h-4' }) => {
  const gradId = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.4"
        stroke={`url(#${gradId})`}
        strokeWidth="2.1"
      />
      <circle
        cx="12"
        cy="12"
        r="4.3"
        stroke={`url(#${gradId})`}
        strokeWidth="2.1"
      />
      <circle cx="17.4" cy="6.6" r="1.35" fill={`url(#${gradId})`} />
    </svg>
  );
};

/**
 * Official Gmail / Direct Email Vector Logo
 */
export const GmailLogo: React.FC<BrandIconProps> = ({ className = 'w-4 h-4' }) => {
  const gradId = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="3"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
      />
      <path
        d="M3 6.5L12 13L21 6.5"
        stroke={`url(#${gradId})`}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
