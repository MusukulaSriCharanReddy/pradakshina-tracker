"use client";

import React, { useState } from "react";
import {
  CompletedSessionRecord,
  getCompletedSessions,
  clearCompletedHistory,
} from "@/lib/session-storage";

interface SessionHistoryViewProps {
  onClose: () => void;
}

export const SessionHistoryView: React.FC<SessionHistoryViewProps> = ({ onClose }) => {
  const [history, setHistory] = useState<CompletedSessionRecord[]>(() => getCompletedSessions());

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your pradakshina history?")) {
      clearCompletedHistory();
      setHistory([]);
    }
  };

  const totalRounds = history.reduce((sum, h) => sum + h.completedRounds, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-[#E8DCC8] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
          <div className="flex items-center gap-2">
            <span className="text-xl text-[#C47737]">ॐ</span>
            <div>
              <h2 className="text-base font-serif font-bold text-[#3D352D]">
                Pradakshina History
              </h2>
              <p className="text-[11px] text-[#7C7267]">
                Total: <strong className="text-[#C47737]">{totalRounds} rounds</strong> across {history.length} sessions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF6F0] text-[#7C7267] hover:text-[#3D352D] flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2.5 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7C7267] flex flex-col items-center">
              <span className="text-3xl mb-2 opacity-50">🪷</span>
              <p className="font-medium text-[#3D352D]">No Pradakshinas Recorded Yet</p>
              <p className="text-[11px] text-[#7C7267] mt-1">
                Completed rounds will be recorded here automatically.
              </p>
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-[#3D352D] font-mono">
                      {record.completedRounds}
                    </span>
                    <span className="text-xs text-[#7C7267] font-mono">
                      / {record.targetRounds} rounds
                    </span>
                    {record.completedRounds >= record.targetRounds && (
                      <span className="text-[10px] text-[#2F855A] font-semibold bg-[#2F855A]/10 px-1.5 py-0.2 rounded-full">
                        Done ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7C7267] mt-0.5">
                    {record.date} • {record.mode === "gps" ? "🛰️ GPS" : "🎮 Sim"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-[#3D352D]">
                    {formatDuration(record.durationSeconds)}
                  </span>
                  <p className="text-[10px] text-[#7C7267]">
                    ~{Math.round(record.approximateDistanceMeters)}m
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E8DCC8] flex items-center justify-between">
          {history.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-700 hover:underline cursor-pointer"
            >
              Clear History
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-[#C47737] text-white text-xs font-semibold hover:opacity-95 cursor-pointer shadow-xs"
          >
            Back to Counter
          </button>
        </div>
      </div>
    </div>
  );
};

