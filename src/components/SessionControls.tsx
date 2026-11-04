"use client";

import React from "react";
import { TrackingState } from "@/types/session";

interface SessionControlsProps {
  state: TrackingState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  onEnterPocketMode?: () => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  state,
  onStart,
  onPause,
  onResume,
  onEnd,
  onEnterPocketMode,
}) => {
  if (state === "idle") {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C47737] via-[#CE7F3F] to-[#D97A32] hover:opacity-95 active:scale-[0.99] text-white font-bold text-base shadow-md shadow-[#C47737]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Start Pradakshina</span>
        </button>
      </div>
    );
  }

  if (state === "completed") {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={onEnd}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C47737] to-[#D97A32] hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#C47737]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Begin New Pradakshina</span>
          <span>→</span>
        </button>
      </div>
    );
  }

  // Active (waiting-for-departure / waiting-for-return) or Paused
  return (
    <div className="w-full flex flex-col gap-2.5">
      {onEnterPocketMode && state !== "paused" && (
        <button
          type="button"
          onClick={onEnterPocketMode}
          className="w-full py-3 px-4 rounded-2xl bg-[#3D352D] hover:bg-[#2A241E] active:scale-[0.98] text-[#F7F1E6] font-semibold text-xs border border-[#3D352D] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="text-sm">📿</span>
          <span>Pocket-Safe Mode (Screen Lock & Audio)</span>
        </button>
      )}

      <div className="w-full grid grid-cols-2 gap-3">
        {state === "paused" ? (
          <button
            type="button"
            onClick={onResume}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#C47737] to-[#D97A32] hover:opacity-95 active:scale-[0.98] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Resume</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPause}
            className="py-3.5 px-4 rounded-2xl bg-[#FAF6F0] hover:bg-[#F2EAE0] active:scale-[0.98] text-[#3D352D] font-semibold text-sm border border-[#E8DCC8] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-current text-[#7C7267]" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <span>Pause</span>
          </button>
        )}

        <button
          type="button"
          onClick={onEnd}
          className="py-3.5 px-4 rounded-2xl bg-[#FAF6F0] hover:bg-[#FBEBEA] active:scale-[0.98] text-[#9B2C2C] font-semibold text-sm border border-[#E8DCC8] hover:border-[#FEB2B2] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 fill-current text-[#9B2C2C]" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z" />
          </svg>
          <span>End Session</span>
        </button>
      </div>
    </div>
  );
};
