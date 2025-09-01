import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface SearchBarProps {
  onSearch: (prompt: string) => void;
  isLoading: boolean;
}

const examplePrompts = [
  "A majestic lion wearing a crown made of stars",
  "A retro-wave synth sunset over a digital ocean",
  "A cute astronaut cat floating in space with planets",
  "A minimalist line art of a mountain range",
  "A graffiti-style robot holding a spray can",
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleRandomPrompt = () => {
    const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setPrompt(randomPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSearch(prompt);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cyberpunk cat DJing in Tokyo..."
          disabled={isLoading}
          className="w-full pl-4 pr-36 py-4 bg-element-bg border border-transparent text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 placeholder-text-secondary"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Generate</span>
        </button>
      </form>
       <div className="text-center mt-3">
        <button 
          onClick={handleRandomPrompt} 
          disabled={isLoading}
          className="text-sm text-primary hover:text-primary-hover font-medium transition-colors duration-200 disabled:opacity-50"
        >
          Inspire Me
        </button>
      </div>
    </div>
  );
};