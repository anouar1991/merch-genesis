import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-error-bg border border-error-border text-error-text px-4 py-3 rounded-lg relative my-4 animate-fade-in" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};