import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const InfiniteScrollLoader: React.FC = () => {
    return (
        <div className="flex items-center justify-center text-center p-8 animate-fade-in" aria-live="polite">
            <SparklesIcon className="w-8 h-8 text-primary animate-pulse-slow" />
            <p className="ml-4 text-text-secondary">Discovering more designs...</p>
        </div>
    );
};