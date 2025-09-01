import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const loadingMessages = [
  "Sketching out your idea...",
  "Generating the core design...",
  "Preparing for the photoshoot...",
  "Finding the perfect model...",
  "Dressing our virtual model...",
  "Capturing the perfect shot...",
  "Adding the finishing touches...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <SparklesIcon className="w-16 h-16 text-primary animate-pulse-slow" />
            <h2 className="mt-4 text-2xl font-bold">Generating Masterpiece</h2>
            <p className="mt-2 text-text-secondary transition-opacity duration-500">{message}</p>
        </div>
    );
};