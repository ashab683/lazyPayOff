import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  CheckSquare,
  BookOpen,
  Mail,
  ShoppingBag,
  FolderGit2
} from 'lucide-react';

const DEMO_INPUT =
  "Need to revise DBMS, email the professor about the assignment, buy groceries, finish the project README, and review tomorrow's lecture notes.";

const DEMO_PREVIEW_CATEGORIES = [
  {
    name: 'Study Tasks',
    icon: BookOpen,
    tasks: [
      {
        title: 'Revise DBMS concepts',
        priority: 'High',
        nextStep: 'Open Chapter 3 on Normalization and skim key terms (15 min)'
      },
      {
        title: "Review tomorrow's lecture notes",
        priority: 'Medium',
        nextStep: 'Highlight key diagrams from the previous lecture slide deck'
      }
    ]
  },
  {
    name: 'College Communication',
    icon: Mail,
    tasks: [
      {
        title: 'Email professor regarding assignment',
        priority: 'High',
        nextStep: 'Draft a 3-sentence email with your question and attach draft'
      }
    ]
  },
  {
    name: 'Project Work',
    icon: FolderGit2,
    tasks: [
      {
        title: 'Complete project README.md',
        priority: 'Medium',
        nextStep: 'Fill in installation steps and environment configuration section'
      }
    ]
  },
  {
    name: 'Personal Errands',
    icon: ShoppingBag,
    tasks: [
      {
        title: 'Buy groceries',
        priority: 'Low',
        nextStep: 'Jot down 5 essentials and head out before 7 PM'
      }
    ]
  }
];

export function DemoSection({ onTryLiveExample, isLoading }) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-br from-lazy-sand/70 via-white to-lazy-orange-light/40 rounded-2xl border border-lazy-border p-6 sm:p-8 text-center shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lazy-orange text-white text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Hacktoberfest 2026 Interactive Showcase</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-lazy-brown-deep">
          The Lazy Payoff in Action
        </h2>
        <p className="mt-2 text-sm sm:text-base text-lazy-brown-light max-w-2xl mx-auto">
          Notice how a single unformatted sentence transforms into four distinct categories with clear priorities and actionable next steps — completely powered by your local Gemma 3 4B model.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onTryLiveExample(DEMO_INPUT)}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-lazy-green text-white font-bold text-sm hover:bg-lazy-green-hover transition shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-lazy-sand" />
            <span>Run This Live with Local Gemma 3</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Before / After Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Messy Input (Before) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-lazy-border shadow-soft p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-lazy-border/60 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Before: Messy Brain Dump
              </span>
              <span className="text-xs text-lazy-muted">Unstructured string</span>
            </div>

            <p className="text-xs text-lazy-muted mb-2">What you write when stressed or procrastinating:</p>
            <div className="p-4 rounded-xl bg-lazy-bg border border-lazy-border text-sm text-lazy-brown font-mono leading-relaxed">
              "{DEMO_INPUT}"
            </div>

            <div className="mt-4 space-y-2 text-xs text-lazy-muted">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>Tasks scattered across different life domains</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>No priorities or sequence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>High cognitive resistance to get started</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-lazy-border/60 text-center">
            <span className="text-xs text-lazy-muted">
              Traditional approach: 15 minutes of manual sorting 😴
            </span>
          </div>
        </div>

        {/* Middle connector arrow for wide screens */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-lazy-sand flex items-center justify-center text-lazy-brown-deep shadow-xs border border-lazy-border">
            <ArrowRight className="w-5 h-5 text-lazy-green" />
          </div>
        </div>

        {/* Right: Organized Output (After) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-lazy-border shadow-soft p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-lazy-border/60 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                After: The Lazy Payoff
              </span>
              <span className="text-xs text-lazy-green font-semibold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                Gemma 3 4B (Local)
              </span>
            </div>

            <p className="text-xs text-lazy-muted mb-3">
              One-click transformation into categorized tasks &amp; low-friction next steps:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_PREVIEW_CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-lazy-border/80 bg-lazy-bg/50"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-lazy-brown-deep mb-2 pb-1 border-b border-lazy-border/60">
                      <Icon className="w-3.5 h-3.5 text-lazy-green" />
                      <span>{cat.name}</span>
                    </div>

                    <div className="space-y-2">
                      {cat.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="bg-white p-2 rounded-lg border border-lazy-border/60 text-xs">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-semibold text-lazy-brown-deep leading-tight">
                              {task.title}
                            </span>
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-[10px] text-lazy-muted bg-lazy-sand/40 p-1 rounded">
                            <span className="font-semibold text-lazy-green">Step: </span>
                            {task.nextStep}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-lazy-border/60 flex items-center justify-between text-xs text-lazy-muted">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lazy payoff: 0 mental friction
            </span>
            <button
              onClick={() => onTryLiveExample(DEMO_INPUT)}
              className="text-lazy-green hover:underline font-bold"
            >
              Test with live model →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
