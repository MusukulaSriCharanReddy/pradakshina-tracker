"use client";

import React from "react";
import { CompletedSessionRecord } from "@/lib/session-storage";

interface SessionSummaryModalProps {
  summary: CompletedSessionRecord;
  onNewSession: () => void;
  onViewHistory: () => void;
  onClose: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  summary,
  onNewSession,
  onViewHistory,
  onClose,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const isTargetAchieved = summary.completedRounds >= summary.targetRounds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-[#E8DCC8] flex flex-col items-center text-center relative">
        {/* Close 'x' button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FAF6F0] text-[#7C7267] hover:text-[#3D352D] flex items-center justify-center text-sm font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Sacred Lotus Badge */}
        <div className="w-14 h-14 rounded-full bg-[#FAF2E9] border border-[#E8DCC8] flex items-center justify-center text-[#C47737] mb-3 shadow-xs">
          <span className="text-2xl">ॐ</span>
        </div>

        <h2 className="text-xl font-serif font-bold text-[#3D352D]">
          {isTargetAchieved ? "Pradakshina Completed 🙏" : "Session Summary"}
        </h2>
        <p className="text-xs text-[#7C7267] mt-0.5">
          {summary.date}
        </p>

        {/* Big Completed Metric */}
        <div className="my-5 p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8] w-full flex flex-col items-center">
          <span className="text-[11px] font-bold text-[#C47737] uppercase tracking-wider mb-0.5">
            Total Rounds
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-[#3D352D] font-mono">
              {summary.completedRounds}
            </span>
            <span className="text-lg text-[#7C7267] font-mono">
              / {summary.targetRounds}
            </span>
          </div>
          {isTargetAchieved && (
            <span className="mt-1.5 text-[11px] text-[#2F855A] font-semibold bg-[#2F855A]/10 px-2.5 py-0.5 rounded-full">
              Target 100% Achieved
            </span>
          )}
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-5">
          <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E8DCC8]/70 flex flex-col items-center">
            <span className="text-[10px] text-[#7C7267] uppercase font-medium">Duration</span>
            <span className="text-sm font-bold text-[#3D352D] mt-0.5">
              {formatDuration(summary.durationSeconds)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E8DCC8]/70 flex flex-col items-center">
            <span className="text-[10px] text-[#7C7267] uppercase font-medium">Approx. Distance</span>
            <span className="text-sm font-bold text-[#3D352D] mt-0.5">
              {formatDistance(summary.approximateDistanceMeters)}
            </span>
          </div>
        </div>

        {/* Peaceful Closing Verse */}
        <p className="text-[11px] italic font-serif text-[#7C7267] mb-5 px-2 leading-relaxed">
          &ldquo;May every step taken with love bring peace, purity, and spiritual grace.&rdquo;
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
          <button
            type="button"
            onClick={onNewSession}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#C47737] to-[#D97A32] text-white font-bold text-sm shadow-md shadow-[#C47737]/25 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
          >
            Begin New Pradakshina
          </button>

          <button
            type="button"
            onClick={onViewHistory}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#FAF6F0] hover:bg-[#F2EAE0] text-[#3D352D] font-semibold text-xs border border-[#E8DCC8] transition-all cursor-pointer"
          >
            View Pradakshina History
          </button>
        </div>
      </div>
    </div>
  );
};

