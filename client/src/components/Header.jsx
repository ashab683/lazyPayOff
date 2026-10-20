import React from 'react';
import { StatusBadge } from './StatusBadge';
import { CheckSquare, History, Sparkles, BookOpen, Layers } from 'lucide-react';

export function Header({ activeTab, onSelectTab, status, onRefreshStatus, taskCount, historyCount }) {
  return (
    <header className="sticky top-0 z-40 bg-lazy-bg/90 backdrop-blur-md border-b border-lazy-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('workspace')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-lazy-sand flex items-center justify-center p-1 shadow-sm border border-lazy-border/60 hover:rotate-3 transition-transform">
              <img src="/favicon.svg" alt="Sloth mascot" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-lazy-brown-deep font-sans">
                  The Lazy Payoff
                </span>
                <span className="text-base sm:text-lg">🦥</span>
              </div>
              <p className="text-xs text-lazy-muted font-medium hidden sm:block">
                Let AI Handle the Boring Stuff
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('workspace')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'workspace'
                  ? 'bg-lazy-green text-white shadow-sm'
                  : 'text-lazy-brown hover:bg-lazy-sand/70'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => onSelectTab('tasks')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'tasks'
                  ? 'bg-lazy-green text-white shadow-sm'
                  : 'text-lazy-brown hover:bg-lazy-sand/70'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Task Board</span>
              {taskCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'tasks' ? 'bg-white/20 text-white' : 'bg-lazy-orange text-white'
                }`}>
                  {taskCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('demo')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-lazy-green text-white shadow-sm'
                  : 'text-lazy-brown hover:bg-lazy-sand/70'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">Live Demo</span>
              <span className="md:hidden">Demo</span>
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'history'
                  ? 'bg-lazy-green text-white shadow-sm'
                  : 'text-lazy-brown hover:bg-lazy-sand/70'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-lazy-sandDark text-lazy-brown-deep'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Local AI status badge */}
          <div className="flex items-center gap-2">
            <StatusBadge status={status} onRefresh={onRefreshStatus} />
          </div>

        </div>
      </div>
    </header>
  );
}
