import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  Share2,
  Cpu,
  Clock,
  ArrowRight,
  ExternalLink,
  Code,
  CheckSquare,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

export function ResultCard({
  result,
  originalInput,
  onSaveToHistory,
  onSendToTaskBoard,
  isSaved
}) {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [checklistChecks, setChecklistChecks] = useState({});

  if (!result) return null;

  const { type, data, model, durationMs } = result;

  const handleCopy = () => {
    let textToCopy = '';

    if (type === 'summary') {
      textToCopy = `${data.summary || ''}\n\nKey Points:\n${(data.bullets || [])
        .map((b) => `• ${b}`)
        .join('\n')}`;
    } else if (type === 'organize') {
      textToCopy = (data.categories || [])
        .map(
          (cat) =>
            `## ${cat.name}\n${cat.tasks
              .map((t) => `- [ ] ${t.title} [Priority: ${t.priority}] (Next: ${t.nextStep})`)
              .join('\n')}`
        )
        .join('\n\n');
    } else if (type === 'actions') {
      textToCopy = (data.actionItems || [])
        .map(
          (a) =>
            `- ${a.task}${a.deadline ? ` [Deadline: ${a.deadline}]` : ''} (${a.priority} priority)`
        )
        .join('\n');
    } else if (type === 'checklist') {
      textToCopy = `# ${data.title || 'Checklist'}\n${(data.checklist || [])
        .map((c) => `${c.step}. ${c.text}${c.tip ? ` (Tip: ${c.tip})` : ''}`)
        .join('\n')}`;
    } else if (type === 'simplify') {
      textToCopy = `${data.simplifiedText}\n\nTakeaways:\n${(data.keyTakeaways || [])
        .map((t) => `• ${t}`)
        .join('\n')}`;
    } else {
      textToCopy = JSON.stringify(data, null, 2);
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleChecklistItem = (idx) => {
    setChecklistChecks((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-lazy-border shadow-soft p-5 sm:p-7 transition-all my-6">
      {/* Result Card Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-lazy-border/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lazy-orange-light text-lazy-orange">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-lazy-brown-deep capitalize">
              {type === 'organize'
                ? 'Organized Action Plan'
                : type === 'summary'
                ? 'Executive Summary & Key Points'
                : type === 'actions'
                ? 'Extracted Action Items'
                : type === 'checklist'
                ? 'Sequential Checklist'
                : 'Simplified Rewrite'}
            </h3>
            <div className="flex items-center gap-3 text-xs text-lazy-muted mt-0.5">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-lazy-green" />
                {model || 'gemma3:4b'}
              </span>
              {durationMs && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {(durationMs / 1000).toFixed(1)}s
                </span>
              )}
              <span className="text-emerald-700 font-medium">✓ Local Verified</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {type === 'organize' && onSendToTaskBoard && (
            <button
              onClick={() => onSendToTaskBoard(data.categories)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-lazy-green text-white hover:bg-lazy-green-hover transition shadow-xs flex items-center gap-1.5"
              title="Add these categories and tasks to your interactive task board"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Send to Task Board</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-lazy-sand/70 hover:bg-lazy-sand text-lazy-brown transition flex items-center gap-1.5 border border-lazy-border/50"
            title="Copy formatted text to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {onSaveToHistory && (
            <button
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-lazy-sand/70 hover:bg-lazy-sand text-lazy-brown border-lazy-border/50'
              }`}
              title="Save this result to browser localStorage"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}

          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="text-xs text-lazy-muted hover:text-lazy-brown p-1.5 rounded-lg hover:bg-lazy-sand/50 transition"
            title="Toggle Raw JSON View"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-5">
        {showRawJson ? (
          <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <>
            {/* 1. Summary Type */}
            {type === 'summary' && (
              <div className="space-y-4">
                {data.summary && (
                  <div className="p-4 rounded-xl bg-lazy-sand/40 border border-lazy-border/60 text-sm sm:text-base text-lazy-brown-deep leading-relaxed">
                    <span className="font-semibold text-lazy-brown block mb-1 text-xs uppercase tracking-wider text-lazy-muted">
                      Overview
                    </span>
                    {data.summary}
                  </div>
                )}
                {data.bullets && data.bullets.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-lazy-muted mb-2">
                      Key Takeaways ({data.bullets.length})
                    </h4>
                    <ul className="space-y-2">
                      {data.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-lazy-brown">
                          <span className="w-1.5 h-1.5 rounded-full bg-lazy-orange mt-2 shrink-0"></span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 2. Organize Tasks Type */}
            {type === 'organize' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(data.categories || []).map((cat, catIdx) => (
                    <div
                      key={catIdx}
                      className="rounded-xl border border-lazy-border/80 bg-lazy-bg/40 p-4"
                    >
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-lazy-border/60">
                        <span className="font-bold text-sm text-lazy-brown-deep">
                          {cat.name}
                        </span>
                        <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-lazy-border text-lazy-muted font-medium">
                          {cat.tasks?.length || 0} tasks
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {(cat.tasks || []).map((task, tIdx) => (
                          <div
                            key={tIdx}
                            className="bg-white p-3 rounded-lg border border-lazy-border/70 shadow-2xs hover:shadow-xs transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-medium text-xs sm:text-sm text-lazy-brown-deep">
                                {task.title}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold border ${getPriorityBadgeClass(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            {task.nextStep && (
                              <div className="mt-2 text-xs text-lazy-muted bg-lazy-sand/40 p-1.5 rounded border border-lazy-border/40 flex items-start gap-1.5">
                                <span className="font-semibold text-lazy-green shrink-0">Next:</span>
                                <span className="italic">{task.nextStep}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Action Items Type */}
            {type === 'actions' && (
              <div className="space-y-3">
                {(data.actionItems || []).map((action, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-lazy-border/80 bg-lazy-bg/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-md bg-lazy-orange-light text-lazy-orange flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-lazy-brown-deep">
                          {action.task}
                        </p>
                        {action.context && (
                          <p className="text-xs text-lazy-muted mt-0.5">{action.context}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {action.deadline && (
                        <span className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Calendar className="w-3 h-3" />
                          {action.deadline}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium border ${getPriorityBadgeClass(
                          action.priority
                        )}`}
                      >
                        {action.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Checklist Type */}
            {type === 'checklist' && (
              <div className="space-y-3">
                {data.title && (
                  <h4 className="font-bold text-sm text-lazy-brown-deep mb-2">{data.title}</h4>
                )}
                <div className="space-y-2">
                  {(data.checklist || []).map((item, idx) => {
                    const isChecked = Boolean(checklistChecks[idx]);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChecklistItem(idx)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/50 border-emerald-200 opacity-75'
                            : 'bg-white border-lazy-border hover:border-lazy-green'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 rounded text-lazy-green focus:ring-lazy-green cursor-pointer"
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              isChecked
                                ? 'line-through text-lazy-muted'
                                : 'text-lazy-brown-deep'
                            }`}
                          >
                            {item.step}. {item.text}
                          </p>
                          {item.tip && (
                            <p className="text-xs text-lazy-muted mt-1 bg-lazy-sand/40 p-1 rounded inline-block">
                              💡 Tip: {item.tip}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Simplify Type */}
            {type === 'simplify' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-lazy-green-light/40 border border-lazy-green/20">
                  <span className="font-bold text-xs uppercase tracking-wider text-lazy-green block mb-2">
                    Clear &amp; Concise Version
                  </span>
                  <p className="text-sm sm:text-base text-lazy-brown-deep leading-relaxed whitespace-pre-line">
                    {data.simplifiedText}
                  </p>
                </div>

                {data.keyTakeaways && data.keyTakeaways.length > 0 && (
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-lazy-muted mb-2">
                      Main Points
                    </h4>
                    <ul className="space-y-1.5">
                      {data.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-lazy-brown">
                          <span className="w-1.5 h-1.5 rounded-full bg-lazy-green mt-1.5 shrink-0"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
