"use client";

import React, { useState } from "react";
import { TrackingState } from "@/types/session";

interface SimulationControlsProps {
  state: TrackingState;
  onSimulateDeparture: () => void;
  onSimulateReturn: () => void;
  onSimulateStayAtStart: () => void;
  onSimulateCompleteCycle: () => void;
  logMessages: string[];
  disabled?: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  state,
  onSimulateDeparture,
  onSimulateReturn,
  onSimulateStayAtStart,
  onSimulateCompleteCycle,
  logMessages,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSessionActive = state === "waiting-for-departure" || state === "waiting-for-return";

  return (
    <div className="w-full bg-[#FAF6F0] text-[#3D352D] rounded-3xl p-4 sm:p-5 shadow-xs border border-[#E8DCC8] text-left mt-2 transition-all">
      {/* Header with Collapse Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C47737] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D352D]">
            Dev Simulation Panel
          </h3>
          <span className="text-[10px] text-[#7C7267] font-medium bg-[#E8DCC8]/60 px-2 py-0.5 rounded-full">
            Milestone 2
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#C47737] font-semibold">
            {state}
          </span>
          <span className="text-xs text-[#7C7267] transition-transform duration-200">
            {isOpen ? "▴" : "▾"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-[#E8DCC8]/70">
          <p className="text-xs text-[#7C7267] mb-3 leading-relaxed">
            Verify the core rule: <strong className="text-[#3D352D]">Start at A → Leave A → Return to A = Count +1</strong>.
          </p>

          {/* Action Buttons in Warm Aesthetic */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              disabled={disabled || !isSessionActive || state === "waiting-for-return"}
              onClick={onSimulateDeparture}
              className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                state === "waiting-for-departure"
                  ? "bg-[#C47737] text-white border-[#C47737] shadow-xs cursor-pointer active:scale-95"
                  : "bg-[#E8DCC8]/40 text-[#7C7267]/60 border-[#E8DCC8]/50 cursor-not-allowed"
              }`}
            >
              1. Leave Point A (&gt;20m)
            </button>

            <button
              type="button"
              disabled={disabled || !isSessionActive || state === "waiting-for-departure"}
              onClick={onSimulateReturn}
              className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                state === "waiting-for-return"
                  ? "bg-[#2F855A] text-white border-[#2F855A] shadow-xs cursor-pointer active:scale-95"
                  : "bg-[#E8DCC8]/40 text-[#7C7267]/60 border-[#E8DCC8]/50 cursor-not-allowed"
              }`}
            >
              2. Return to Point A (&lt;8m)
            </button>

            <button
              type="button"
              disabled={disabled || !isSessionActive}
              onClick={onSimulateStayAtStart}
              className="py-2 px-3 rounded-xl text-xs font-medium text-[#3D352D] bg-[#FAF2E9] hover:bg-[#F2EAE0] border border-[#E8DCC8] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              Jitter at Start (No +1)
            </button>

            <button
              type="button"
              disabled={disabled || !isSessionActive}
              onClick={onSimulateCompleteCycle}
              className="py-2 px-3 rounded-xl text-xs font-medium text-[#C47737] bg-[#FAF2E9] hover:bg-[#F2EAE0] border border-[#C47737]/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              Full Cycle (+1)
            </button>
          </div>

          {/* Event Log in Warm Devotional Styling */}
          <div className="bg-[#FAF2E9]/80 rounded-xl p-2.5 border border-[#E8DCC8] text-[11px] font-mono">
            <div className="text-[#7C7267] font-semibold mb-1 flex items-center justify-between text-[10px] uppercase">
              <span>Event Activity</span>
              <span className="font-normal text-[9px]">Latest first</span>
            </div>
            <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-1">
              {logMessages.length === 0 ? (
                <span className="text-[#A89F91] italic">Ready. Tap &apos;Start Pradakshina&apos; above.</span>
              ) : (
                logMessages.map((log, index) => (
                  <span
                    key={index}
                    className={index === 0 ? "text-[#C47737] font-medium" : "text-[#5A5147]"}
                  >
                    › {log}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
