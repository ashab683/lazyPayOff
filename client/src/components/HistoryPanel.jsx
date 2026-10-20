import React, { useState } from 'react';
import {
  History,
  Trash2,
  FolderOpen,
  Calendar,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { formatRelativeTime, truncate } from '../utils/sanitize';

export function HistoryPanel({
  history,
  onReopenItem,
  onDeleteItem,
  onClearHistory,
  onOpenWorkspace
}) {
  const [filterType, setFilterType] = useState('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered =
    filterType === 'all'
      ? history
      : history.filter((item) => item.type === filterType);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'organize':
        return { label: 'Tasks', color: 'bg-lazy-green-light text-lazy-green border-lazy-green/30' };
      case 'summary':
        return { label: 'Summary', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'actions':
        return { label: 'Actions', color: 'bg-lazy-orange-light text-lazy-orange border-lazy-orange/30' };
      case 'checklist':
        return { label: 'Checklist', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'simplify':
        return { label: 'Simplify', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      default:
        return { label: type, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-lazy-border shadow-soft p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-lazy-brown-deep">
              Local History
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-lazy-sand text-lazy-brown font-bold">
              {history.length} Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-lazy-muted mt-1">
            Persisted in your browser's localStorage. Zero tracking, zero accounts.
          </p>
        </div>

        {/* Filter & Clear Controls */}
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs font-medium px-3 py-2 rounded-xl bg-lazy-sand/70 border border-lazy-border focus:outline-none focus:border-lazy-green"
              >
                <option value="all">All Types</option>
                <option value="organize">Organize</option>
                <option value="summary">Summary</option>
                <option value="actions">Actions</option>
                <option value="checklist">Checklist</option>
                <option value="simplify">Simplify</option>
              </select>

              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs font-semibold px-3 py-2 rounded-xl text-lazy-muted hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                title="Clear all saved history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-lazy-border text-center animate-in zoom-in-95">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-lazy-brown-deep">Clear All History?</h3>
            <p className="text-xs text-lazy-muted mt-1 leading-relaxed">
              This will permanently delete all {history.length} saved results from your browser.
            </p>
            <div className="mt-5 flex gap-2 justify-center">
              <button
                onClick={() => setConfirmClear(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-lazy-sand text-lazy-brown hover:bg-lazy-sandDark transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setConfirmClear(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-lazy-border p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-lazy-sand/60 mx-auto flex items-center justify-center text-3xl mb-4">
            📚
          </div>
          <h3 className="font-bold text-lg text-lazy-brown-deep">No Saved Results Yet</h3>
          <p className="text-xs sm:text-sm text-lazy-muted mt-1 max-w-md mx-auto">
            When you run an action in the workspace, click the <strong>Save</strong> button on the result card to keep it here for quick reference.
          </p>
          <div className="mt-5">
            <button
              onClick={onOpenWorkspace}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-lazy-green text-white hover:bg-lazy-green-hover transition shadow-sm inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Go to Workspace</span>
            </button>
          </div>
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const badge = getTypeBadge(item.type);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-lazy-border shadow-soft p-5 flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-lazy-border/50">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-lazy-muted">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-lazy-brown-deep line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-lazy-muted line-clamp-3 leading-relaxed mb-3">
                    {item.preview || truncate(item.originalInput, 120)}
                  </p>
                </div>

                <div className="pt-3 border-t border-lazy-border/50 flex items-center justify-between">
                  <button
                    onClick={() => onReopenItem(item)}
                    className="text-xs font-semibold text-lazy-green hover:text-lazy-green-dark flex items-center gap-1 transition"
                  >
                    <span>Reopen Result</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-lazy-muted hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
