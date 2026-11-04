"use client";

import React, { useState, useRef, useEffect } from "react";
import { TrackingState, TrackingMode } from "@/types/session";

interface PocketModeOverlayProps {
  count: number;
  target: number;
  state: TrackingState;
  mode: TrackingMode;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onExitPocketMode: () => void;
}

export const PocketModeOverlay: React.FC<PocketModeOverlayProps> = ({
  count,
  target,
  state,
  mode,
  voiceEnabled,
  onToggleVoice,
  onExitPocketMode,
}) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    const startTime = Date.now();
    const duration = 1200; // 1.2 seconds hold to unlock

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);
    }, 30);

    holdTimerRef.current = setTimeout(() => {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(80);
        } catch {}
      }
      onExitPocketMode();
    }, duration);
  };

  const cancelHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0908] text-[#E8DCC8] flex flex-col justify-between items-center p-6 select-none animate-in fade-in duration-200">
      {/* Top Status Row */}
      <div className="w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#A89F91]">
            {mode === "gps" ? "GPS Active in Pocket" : "Simulator Active"}
          </span>
        </div>

        {/* Voice Announcement Toggle Button */}
        <button
          type="button"
          onClick={onToggleVoice}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
            voiceEnabled
              ? "bg-[#C47737]/20 border-[#C47737] text-[#FEF3C7]"
              : "bg-white/5 border-white/15 text-[#7C7267]"
          }`}
        >
          <span>{voiceEnabled ? "🗣️ Voice: ON" : "🔇 Voice: OFF"}</span>
        </button>
      </div>

      {/* Center Giant Ambient Counter */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <span className="text-xs uppercase tracking-widest text-[#C47737] font-semibold mb-2">
          Current Circumambulation
        </span>

        <div className="text-8xl sm:text-9xl font-serif font-extrabold text-[#FEF3C7] tracking-tight drop-shadow-sm">
          {count}
        </div>

        <div className="text-sm font-medium text-[#A89F91] mt-2">
          of <span className="text-[#FEF3C7] font-bold">{target}</span> rounds
        </div>

        {/* State Status Text */}
        <div className="mt-5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#E8DCC8]">
          {state === "waiting-for-departure" && "Walking away from Point A..."}
          {state === "waiting-for-return" && "Circling back to Point A..."}
          {state === "paused" && "Paused"}
          {state === "completed" && "Pradakshina Completed! 🙏"}
        </div>
      </div>

      {/* Bottom Hold-to-Unlock Container */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2 pb-4">
        <button
          type="button"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          className="relative w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-xs tracking-wider uppercase overflow-hidden cursor-pointer active:scale-98 transition-all"
        >
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#C47737] transition-all ease-linear"
            style={{ width: `${holdProgress}%` }}
          />

          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {isHolding ? "Keep Holding..." : "Press & Hold to Unlock"}
          </span>
        </button>

        <p className="text-[10px] text-[#7C7267] text-center">
          Pocket lock active • Screen Wake Lock prevents sleep • Bell rings on each round
        </p>
      </div>
    </div>
  );
};
