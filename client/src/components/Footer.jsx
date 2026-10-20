import React from 'react';
import { Heart, Github, Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-lazy-border/80 bg-white/50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-lazy-muted">
        
        <div className="flex items-center gap-2">
          <span className="text-base">🦥</span>
          <span className="font-bold text-lazy-brown-deep">The Lazy Payoff</span>
          <span>·</span>
          <span>Hacktoberfest 2026 Open-Source AI Challenge</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-lazy-sand px-2.5 py-1 rounded-md font-mono text-[11px] text-lazy-brown">
            #devchallenge
          </span>
          <span className="bg-lazy-sand px-2.5 py-1 rounded-md font-mono text-[11px] text-lazy-brown">
            #hf26challenge
          </span>
          <span className="hidden md:inline text-lazy-muted">
            Week Theme: <strong>Slow and Steady</strong>
          </span>
        </div>

        <div className="text-center sm:text-right">
          <p>Local inference via Ollama &amp; Gemma 3 4B</p>
        </div>

      </div>
    </footer>
  );
}
