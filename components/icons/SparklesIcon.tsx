
import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-1.76 1.22-3.298 2.9-3.834.4-.132.8-.275 1.185-.436a6.75 6.75 0 00-2.826-8.756zM6.75 15.75c0-1.76-1.22-3.298-2.9-3.834a.75.75 0 00-.816.143 6.75 6.75 0 00-2.826 8.756C3.065 21.117 4.86 22.5 6.75 22.5a.75.75 0 00.75-.75v-6z"
      clipRule="evenodd"
    />
  </svg>
);
