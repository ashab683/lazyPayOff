import React from 'react';
import { ShieldCheck, Zap, Sliders, ArrowRight } from 'lucide-react';

export function Hero({ onTryExample, onOpenDemo }) {
  return (
    <section className="pt-6 pb-4 sm:pt-10 sm:pb-8 text-center max-w-4xl mx-auto px-4">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lazy-orange-light border border-lazy-orange/20 text-lazy-orange text-xs font-semibold uppercase tracking-wider mb-4 animate-in fade-in slide-in-from-top-2">
        <span>🦥 Slow & Steady AI · Hacktoberfest 2026</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-lazy-brown-deep tracking-tight leading-tight">
        Too much to do? <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-lazy-green to-lazy-orange">
          Let AI handle the boring part.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-base sm:text-lg text-lazy-brown-light max-w-2xl mx-auto leading-relaxed">
        The local-first AI assistant that cures digital procrastination. Paste your messy notes or rambling to-do lists — Gemma 3 4B organizes, categorizes, and finds manageable next steps right on your device.
      </p>

      {/* Value props pill row */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-lazy-brown font-medium">
        <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-lazy-border/80 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-lazy-green" />
          <span>100% Private (Runs via Ollama)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-lazy-border/80 shadow-xs">
          <Zap className="w-4 h-4 text-lazy-orange" />
          <span>Zero Cloud API Subscriptions</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-lazy-border/80 shadow-xs">
          <Sliders className="w-4 h-4 text-lazy-brown" />
          <span>One-Click Actionable Plans</span>
        </div>
      </div>
    </section>
  );
}
