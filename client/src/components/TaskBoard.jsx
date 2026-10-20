import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Trash2,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

export function TaskBoard({
  categories,
  onToggleComplete,
  onDeleteTask,
  onAddTask,
  onClearAllTasks,
  onOpenWorkspace
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('Personal');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newNextStep, setNewNextStep] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const totalTasks = categories.reduce((sum, c) => sum + (c.tasks?.length || 0), 0);
  const completedTasks = categories.reduce(
    (sum, c) => sum + (c.tasks?.filter((t) => t.completed)?.length || 0),
    0
  );
  const percentDone = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newCatName, {
      title: newTitle.trim(),
      priority: newPriority,
      nextStep: newNextStep.trim() || 'Begin step 1.'
    });
    setNewTitle('');
    setNewNextStep('');
    setShowAddModal(false);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Board Header Bar */}
      <div className="bg-white rounded-2xl border border-lazy-border shadow-soft p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-lazy-brown-deep">
              Smart Task Board
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-lazy-green-light text-lazy-green font-bold">
              Local Storage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-lazy-muted mt-1">
            Tasks organized by Gemma 3 4B into categories with bite-sized next steps.
          </p>
        </div>

        {/* Progress & Controls */}
        <div className="flex items-center gap-3">
          {totalTasks > 0 && (
            <div className="text-right mr-2 hidden sm:block">
              <div className="text-xs font-semibold text-lazy-brown-deep">
                {completedTasks} of {totalTasks} Completed ({percentDone}%)
              </div>
              <div className="w-36 h-2 bg-lazy-sand rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-lazy-green transition-all duration-300"
                  style={{ width: `${percentDone}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-lazy-sand hover:bg-lazy-sandDark text-lazy-brown transition flex items-center gap-1.5 border border-lazy-border/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>

          {totalTasks > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-xs font-medium px-3 py-2 rounded-xl text-lazy-muted hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
              title="Clear all tasks from the board"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-lazy-border text-center animate-in zoom-in-95">
            <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-lazy-brown-deep">Clear All Tasks?</h3>
            <p className="text-xs text-lazy-muted mt-1 leading-relaxed">
              This will remove all categories and tasks currently on the board.
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
                  onClearAllTasks();
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

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreateTask}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-lazy-border animate-in zoom-in-95"
          >
            <h3 className="font-bold text-base text-lazy-brown-deep mb-4">Add New Task</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-lazy-brown block mb-1">Category</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Study, Work, Personal"
                  className="w-full p-2.5 rounded-lg border border-lazy-border focus:outline-none focus:border-lazy-green"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-lazy-brown block mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full p-2.5 rounded-lg border border-lazy-border focus:outline-none focus:border-lazy-green"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-lazy-brown block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-lazy-border focus:outline-none focus:border-lazy-green bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-lazy-brown block mb-1">Manageable Next Step</label>
                  <input
                    type="text"
                    value={newNextStep}
                    onChange={(e) => setNewNextStep(e.target.value)}
                    placeholder="e.g. Open textbook pg 40"
                    className="w-full p-2.5 rounded-lg border border-lazy-border focus:outline-none focus:border-lazy-green"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs rounded-lg text-lazy-muted hover:bg-lazy-sand"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs rounded-lg bg-lazy-green text-white font-semibold hover:bg-lazy-green-hover"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-lazy-border p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-lazy-sand/60 mx-auto flex items-center justify-center text-3xl mb-4">
            🦥
          </div>
          <h3 className="font-bold text-lg text-lazy-brown-deep">Your Task Board is Calm &amp; Empty</h3>
          <p className="text-xs sm:text-sm text-lazy-muted mt-1 max-w-md mx-auto">
            Paste a messy brain dump in the Workspace and click <strong>Organize Tasks</strong> to let Gemma 3 4B populate this board automatically.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={onOpenWorkspace}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-lazy-green text-white hover:bg-lazy-green-hover transition shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Go to Workspace</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-lazy-sand text-lazy-brown hover:bg-lazy-sandDark transition"
            >
              Add Task Manually
            </button>
          </div>
        </div>
      ) : (
        /* Categorized Columns Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((category, catIdx) => {
            const catCompleted = category.tasks.filter((t) => t.completed).length;
            const catTotal = category.tasks.length;

            return (
              <div
                key={catIdx}
                className="bg-white rounded-2xl border border-lazy-border shadow-soft p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-lazy-border/60 mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-lazy-green" />
                      <h3 className="font-bold text-sm text-lazy-brown-deep">
                        {category.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-lazy-sand text-lazy-brown font-medium">
                      {catCompleted}/{catTotal}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5">
                    {category.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl border transition-all ${
                          task.completed
                            ? 'bg-lazy-bg/50 border-lazy-border/40 opacity-60'
                            : 'bg-white border-lazy-border/80 hover:border-lazy-border hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => onToggleComplete(task.id)}
                            className="text-left flex items-start gap-2 flex-1"
                          >
                            <span className="mt-0.5 text-lazy-green">
                              {task.completed ? (
                                <CheckSquare className="w-4 h-4 text-lazy-green fill-lazy-green-light" />
                              ) : (
                                <Square className="w-4 h-4 text-lazy-muted" />
                              )}
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-medium ${
                                task.completed
                                  ? 'line-through text-lazy-muted'
                                  : 'text-lazy-brown-deep'
                              }`}
                            >
                              {task.title}
                            </span>
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${getPriorityStyle(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="text-lazy-muted hover:text-rose-600 p-1 rounded transition"
                              title="Delete task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Next Step Suggestion */}
                        {task.nextStep && !task.completed && (
                          <div className="mt-2 text-xs bg-lazy-sand/40 border border-lazy-border/40 p-2 rounded-lg flex items-start gap-1.5 text-lazy-brown">
                            <span className="font-bold text-lazy-green shrink-0">
                              ⚡ Next:
                            </span>
                            <span className="text-[11px] leading-relaxed">
                              {task.nextStep}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-4 pt-3 border-t border-lazy-border/40 flex justify-between items-center text-[11px] text-lazy-muted">
                  <span>Saved in local storage</span>
                  {catCompleted === catTotal && catTotal > 0 && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> All Done!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
