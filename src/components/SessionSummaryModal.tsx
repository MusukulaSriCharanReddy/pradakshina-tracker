"use client";

import React, { useState } from "react";
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
  const [copied, setCopied] = useState(false);

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

  const shareText = `🙏 Pradakshina Sankalpa Fulfilled!\n` +
    `• Completed: ${summary.completedRounds} / ${summary.targetRounds} rounds\n` +
    `• Duration: ${formatDuration(summary.durationSeconds)}\n` +
    `• Date: ${summary.date}\n\n` +
    `"तानि सर्वाणि नश्यन्ति प्रदक्षिण पदे पदे ॥"\n` +
    `Tracked with Pradakshina Tracker: https://pradakshina-tracker.vercel.app`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Pradakshina Completed 🙏",
          text: shareText,
          url: "https://pradakshina-tracker.vercel.app",
        });
        return;
      } catch {
        // Fallback to WhatsApp
      }
    }
    handleShareWhatsApp();
  };

  const handleCopyText = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E8DCC8] flex flex-col items-center text-center relative max-h-[90vh] overflow-y-auto">
        {/* Close 'x' button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FAF6F0] text-[#7C7267] hover:text-[#3D352D] flex items-center justify-center text-sm font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Sacred Lotus Motif */}
        <div className="w-12 h-12 rounded-full bg-[#FAF2E9] border border-[#E8DCC8] flex items-center justify-center text-[#C47737] mb-2 shadow-xs">
          <span className="text-xl">ॐ</span>
        </div>

        {/* Sankalpa Header */}
        <h2 className="text-base font-serif font-bold text-[#3D352D]">
          {isTargetAchieved ? "Pradakshina Sankalpa Fulfilled 🙏" : "Pradakshina Completed"}
        </h2>
        <p className="text-[11px] text-[#7C7267] mt-0.5">
          {summary.date}
        </p>

        {/* Sacred Blessing Certificate Card */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-[#FAF6F0] via-[#FFF9F2] to-[#FAF2E9] border-2 border-[#C47737]/35 w-full flex flex-col items-center shadow-inner relative">
          <div className="text-[10px] uppercase font-bold text-[#C47737] tracking-widest mb-1">
            ॥ सङ्कल्प सिद्धिः ॥
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-4xl font-extrabold text-[#3D352D] font-mono">
              {summary.completedRounds}
            </span>
            <span className="text-base text-[#7C7267] font-mono">
              / {summary.targetRounds}
            </span>
          </div>

          <p className="text-xs font-serif text-[#C47737] font-semibold">
            Circumambulations Completed
          </p>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-3 border-t border-[#E8DCC8]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#7C7267] uppercase font-medium">Duration</span>
              <span className="text-xs font-bold text-[#3D352D] font-mono">
                {formatDuration(summary.durationSeconds)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#7C7267] uppercase font-medium">Distance</span>
              <span className="text-xs font-bold text-[#3D352D] font-mono">
                {formatDistance(summary.approximateDistanceMeters)}
              </span>
            </div>
          </div>

          {/* Sacred Blessing Verse */}
          <div className="mt-3 pt-2 text-[10px] italic font-serif text-[#7C7267] text-center border-t border-[#E8DCC8]/60">
            &ldquo;Whatever karma was gathered, may it dissolve with every step.&rdquo;
          </div>
        </div>

        {/* Share Buttons Row */}
        <div className="grid grid-cols-2 gap-2 w-full mb-3">
          <button
            type="button"
            onClick={handleNativeShare}
            className="py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <span>💬</span>
            <span>Share WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="py-2.5 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#F2EAE0] border border-[#E8DCC8] text-[#3D352D] font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
          >
            <span>{copied ? "✓ Copied!" : "📋 Copy Blessing"}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
          <button
            type="button"
            onClick={onNewSession}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C47737] to-[#D97A32] text-white font-bold text-xs shadow-md shadow-[#C47737]/25 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
          >
            Begin New Pradakshina
          </button>

          <button
            type="button"
            onClick={onViewHistory}
            className="w-full py-2 px-4 rounded-xl bg-[#FAF6F0] hover:bg-[#F2EAE0] text-[#7C7267] font-semibold text-[11px] border border-[#E8DCC8] transition-all cursor-pointer"
          >
            View History Logs
          </button>
        </div>
      </div>
    </div>
  );
};
