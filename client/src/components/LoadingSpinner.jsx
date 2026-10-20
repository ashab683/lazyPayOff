import React, { useState, useEffect } from 'react';

const SLOTH_MESSAGES = [
  "Slow and steady wins the race... 🦥",
  "Gemma 3 4B is sorting the messy stuff...",
  "Running local neural inference on your machine...",
  "Turning chaos into an organized plan...",
  "Taking it easy so you don't have to..."
];

export function LoadingSpinner({ durationMs }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % SLOTH_MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-lazy-border shadow-soft p-8 sm:p-12 text-center my-6 flex flex-col items-center justify-center animate-in fade-in">
      {/* Animated sloth / spinner */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-lazy-sand border-t-lazy-orange animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-lazy-sand/60 flex items-center justify-center text-2xl animate-bounce">
          🦥
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-lazy-brown-deep">
        {SLOTH_MESSAGES[msgIndex]}
      </h3>

      <p className="mt-2 text-xs sm:text-sm text-lazy-muted max-w-md">
        Running locally on your hardware with Ollama. Zero network requests to outside AI clouds.
      </p>

      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lazy-sand text-xs font-mono text-lazy-brown">
        <span className="w-2 h-2 rounded-full bg-lazy-orange animate-ping"></span>
        <span>Model: gemma3:4b</span>
      </div>
    </div>
  );
}
