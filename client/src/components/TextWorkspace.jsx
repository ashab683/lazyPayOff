import React, { useState } from 'react';
import { QuickActions } from './QuickActions';
import { Trash2, FileText, CornerDownLeft, Sparkles, AlertCircle } from 'lucide-react';

const SAMPLE_TEXTS = [
  {
    label: 'College & Life Dump',
    text: `Need to revise DBMS, email the professor about the assignment, buy groceries, finish the project README, and review tomorrow's lecture notes.`
  },
  {
    label: 'Messy Meeting Notes',
    text: `Sprint retrospective notes: Team noted that database migrations are bottlenecking deploy pipelines. Alex said to implement automated migration scripts before Friday 5 PM. Sarah needs to prepare demo slides for stakeholder review on Monday morning. Also need to renew domain name and order more ergonomic wrist rests for the lab.`
  },
  {
    label: 'Overwhelmed Brain Dump',
    text: `Tomorrow is crazy. First thing call dentist to reschedule 2pm appt. Pay internet bill before cutoff. Review PR #42 on repo. Pack workout clothes. Send tax receipt to accountant. Finish chapter 4 of distributed systems textbook. Remember to buy oat milk.`
  }
];

export function TextWorkspace({
  text,
  onChangeText,
  onRunAction,
  isLoading,
  error,
  ollamaStatus
}) {
  const [sampleIndex, setSampleIndex] = useState(0);
  const maxChars = 8000;
  const charCount = text.length;
  const isOverLimit = charCount > maxChars;

  const handleCycleSample = () => {
    const nextIdx = (sampleIndex + 1) % SAMPLE_TEXTS.length;
    setSampleIndex(nextIdx);
    onChangeText(SAMPLE_TEXTS[sampleIndex].text);
  };

  return (
    <div className="bg-white rounded-2xl border border-lazy-border shadow-soft p-4 sm:p-6 transition-all">
      {/* Top Header of Textarea */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-lazy-border/60 mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-lazy-green" />
          <h2 className="font-bold text-sm sm:text-base text-lazy-brown-deep">
            Input Workspace
          </h2>
          <span className="text-xs text-lazy-muted hidden sm:inline">
            Paste anything messy: notes, to-dos, or jumbled thoughts
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCycleSample}
            disabled={isLoading}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-lazy-sand/70 hover:bg-lazy-sand text-lazy-brown transition flex items-center gap-1 border border-lazy-border/50"
            title="Load a realistic messy to-do sample"
          >
            <Sparkles className="w-3 h-3 text-lazy-orange" />
            <span>Load Sample ({SAMPLE_TEXTS[sampleIndex].label})</span>
          </button>

          {text.length > 0 && (
            <button
              type="button"
              onClick={() => onChangeText('')}
              disabled={isLoading}
              className="text-xs text-lazy-muted hover:text-rose-600 px-2 py-1 rounded transition flex items-center gap-1"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Paste messy notes, rambling to-dos, or an email thread here... e.g. 'Need to revise DBMS, email the professor, buy groceries, finish README...'"
          rows={6}
          disabled={isLoading}
          className={`w-full rounded-xl p-3.5 text-sm sm:text-base text-lazy-brown-deep bg-lazy-bg/50 border focus:bg-white focus:outline-none transition-all resize-y ${
            isOverLimit
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-lazy-border focus:border-lazy-green focus:ring-2 focus:ring-lazy-green-light'
          }`}
        />

        {/* Character Counter & Helper */}
        <div className="flex justify-between items-center mt-2 px-1 text-xs">
          <div className="text-lazy-muted flex items-center gap-1">
            {isOverLimit ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Text too long! Maximum {maxChars} characters allowed.
              </span>
            ) : (
              <span>Tip: Click any button below to process with local Gemma 3 4B</span>
            )}
          </div>

          <div
            className={`font-mono text-[11px] ${
              isOverLimit ? 'text-rose-600 font-bold' : 'text-lazy-muted'
            }`}
          >
            {charCount.toLocaleString()} / {maxChars.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error.title || 'Action Failed'}</p>
            <p className="mt-0.5 text-rose-700 leading-relaxed">{error.message}</p>
            {error.instruction && (
              <code className="block mt-2 p-2 bg-white rounded border border-rose-200 font-mono text-xs text-rose-900">
                {error.instruction}
              </code>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="mt-5 pt-4 border-t border-lazy-border/60">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-lazy-muted">
            One-Click Automation
          </span>
          <span className="text-[11px] text-lazy-muted">
            No prompt engineering required
          </span>
        </div>

        <QuickActions
          onAction={onRunAction}
          isLoading={isLoading}
          disabled={text.trim().length === 0 || isOverLimit}
        />
      </div>
    </div>
  );
}
