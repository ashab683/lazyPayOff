import React from 'react';
import { AlignLeft, CheckSquare, Target, Sparkles, ListChecks } from 'lucide-react';

export const ACTIONS = [
  {
    id: 'organize',
    title: 'Organize Tasks',
    subtitle: 'Group into Study, Work, Personal + next steps',
    icon: CheckSquare,
    accent: 'border-lazy-green/40 hover:border-lazy-green text-lazy-green hover:bg-lazy-green-light/40',
    badge: 'Popular',
    badgeColor: 'bg-lazy-green text-white'
  },
  {
    id: 'summarize',
    title: 'Summarize This',
    subtitle: 'Extract concise bullet points & overview',
    icon: AlignLeft,
    accent: 'border-amber-200 hover:border-amber-500 text-amber-700 hover:bg-amber-50',
    badge: null
  },
  {
    id: 'extract-actions',
    title: 'Extract Action Items',
    subtitle: 'Find deadlines, owners, and urgent tasks',
    icon: Target,
    accent: 'border-lazy-orange/40 hover:border-lazy-orange text-lazy-orange hover:bg-lazy-orange-light/50',
    badge: null
  },
  {
    id: 'simplify',
    title: 'Make This Easier',
    subtitle: 'Rewrite in clear, low-cognitive-load language',
    icon: Sparkles,
    accent: 'border-purple-200 hover:border-purple-400 text-purple-700 hover:bg-purple-50',
    badge: null
  },
  {
    id: 'checklist',
    title: 'Create Checklist',
    subtitle: 'Turn unstructured notes into steps',
    icon: ListChecks,
    accent: 'border-emerald-200 hover:border-emerald-400 text-emerald-700 hover:bg-emerald-50',
    badge: null
  }
];

export function QuickActions({ onAction, isLoading, disabled }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            disabled={disabled || isLoading}
            className={`group relative text-left p-3.5 rounded-xl border bg-white shadow-soft transition-all duration-150 flex flex-col justify-between ${
              action.accent
            } ${
              disabled || isLoading
                ? 'opacity-60 cursor-not-allowed hover:bg-white'
                : 'hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
            }`}
          >
            {action.badge && (
              <span className={`absolute -top-2 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${action.badgeColor}`}>
                {action.badge}
              </span>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-lazy-sand/60 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-lazy-brown-deep font-sans">
                  {action.title}
                </span>
              </div>
              <p className="text-xs text-lazy-muted line-clamp-2 leading-relaxed">
                {action.subtitle}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Execute with Gemma</span>
              <span className="text-xs">→</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
