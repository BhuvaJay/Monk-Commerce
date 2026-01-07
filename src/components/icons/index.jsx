import { memo } from 'react';

export const DragHandleIcon = memo(({ className = '' }) => (
  <svg 
    className={className}
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="1.5" fill="currentColor" />
    <circle cx="6" cy="10" r="1.5" fill="currentColor" />
    <circle cx="6" cy="14" r="1.5" fill="currentColor" />
    <circle cx="10" cy="6" r="1.5" fill="currentColor" />
    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    <circle cx="10" cy="14" r="1.5" fill="currentColor" />
  </svg>
));

DragHandleIcon.displayName = 'DragHandleIcon';

export const EditIcon = memo(({ className = '' }) => (
  <svg 
    className={className}
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M11.333 2.00004C11.5081 1.82494 11.7169 1.68605 11.9474 1.59129C12.1779 1.49653 12.4254 1.44775 12.6754 1.44775C12.9254 1.44775 13.1729 1.49653 13.4034 1.59129C13.6339 1.68605 13.8427 1.82494 14.0178 2.00004C14.1929 2.17513 14.3318 2.38398 14.4265 2.61448C14.5213 2.84499 14.5701 3.09248 14.5701 3.34254C14.5701 3.5926 14.5213 3.84009 14.4265 4.07059C14.3318 4.3011 14.1929 4.50995 14.0178 4.68504L5.00004 13.7028L1.33337 14.6667L2.29729 11.0001L11.333 2.00004Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

EditIcon.displayName = 'EditIcon';

export const CloseIcon = memo(({ className = '' }) => (
  <svg 
    className={className}
    width="14" 
    height="14" 
    viewBox="0 0 14 14" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M13 1L1 13M1 1L13 13" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

CloseIcon.displayName = 'CloseIcon';

export const SearchIcon = memo(({ className = '' }) => (
  <svg 
    className={className}
    width="18" 
    height="18" 
    viewBox="0 0 18 18" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M15.75 15.75L12.4875 12.4875" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

SearchIcon.displayName = 'SearchIcon';

export const ChevronDownIcon = memo(({ className = '' }) => (
  <svg 
    className={className}
    width="12" 
    height="12" 
    viewBox="0 0 12 12" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 4.5L6 7.5L9 4.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

ChevronDownIcon.displayName = 'ChevronDownIcon';

export const ChevronUpIcon = memo(({ className = '' }) => (
  <svg 
    className={className}
    width="12" 
    height="12" 
    viewBox="0 0 12 12" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M9 7.5L6 4.5L3 7.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

ChevronUpIcon.displayName = 'ChevronUpIcon';

export const CheckIcon = memo(({ className = '' }) => (
  <svg 
    className={className}
    width="14" 
    height="14" 
    viewBox="0 0 14 14" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M11.6667 3.5L5.25 9.91667L2.33333 7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

CheckIcon.displayName = 'CheckIcon';

