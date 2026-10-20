import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

export function StatusBadge({ status, onRefresh }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const isConnected = status.reachable && status.modelAvailable;
  const isPartiallyConnected = status.reachable && !status.modelAvailable;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
          isConnected
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            : isPartiallyConnected
            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
        }`}
        title="Click to view local AI model connection details"
      >
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected
                ? 'bg-emerald-500'
                : isPartiallyConnected
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          ></span>
        </span>

        <Cpu className="w-3.5 h-3.5" />
        <span>
          {isConnected
            ? `Local AI: ${status.configuredModel}`
            : isPartiallyConnected
            ? `Model missing: ${status.configuredModel}`
            : 'Local AI Offline'}
        </span>
      </button>

      {/* Dropdown status info */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-lazy-border p-4 z-50 text-left text-sm text-lazy-brown animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-lazy-border">
            <span className="font-semibold text-lazy-brown-deep flex items-center gap-2">
              <Cpu className="w-4 h-4 text-lazy-green" />
              Ollama Connection
            </span>
            <button
              onClick={onRefresh}
              className="text-lazy-muted hover:text-lazy-green p-1 rounded-md transition"
              title="Refresh status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-lazy-muted">Ollama Server:</span>
              <span className="font-mono font-medium">
                {status.reachable ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Online
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Offline
                  </span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lazy-muted">Active Model:</span>
              <span className="font-mono font-medium">
                {status.configuredModel}
                {status.modelAvailable ? (
                  <span className="text-emerald-700 ml-1">✓</span>
                ) : (
                  <span className="text-rose-600 ml-1">✗</span>
                )}
              </span>
            </div>

            {status.availableModels && status.availableModels.length > 0 && (
              <div className="pt-2 border-t border-lazy-border">
                <span className="text-lazy-muted block mb-1">Installed Models:</span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {status.availableModels.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 bg-lazy-sand rounded text-[11px] font-mono"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!isConnected && status.setupInstruction && (
              <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                <p className="font-semibold mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  Quick Action Required:
                </p>
                <code className="block bg-white p-1 rounded border border-amber-200 font-mono text-[10px] break-all">
                  {status.setupInstruction}
                </code>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-lazy-border text-[11px] text-lazy-muted">
            100% local inference. Your text never leaves this computer.
          </div>
        </div>
      )}
    </div>
  );
}
