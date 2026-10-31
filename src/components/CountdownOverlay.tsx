"use client";

import React from "react";

interface CountdownOverlayProps {
  count: number; // 3, 2, 1, or 0 (0 = "Begin!")
  onCancel: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  count,
  onCancel,
}) => {
  const isGo = count === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DCC8] flex flex-col items-center text-center">
        {/* Animated Countdown Circle */}
        <div className="relative w-28 h-28 flex items-center justify-center my-3">
          {/* Subtle outer pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-[#FAF2E9] border-2 border-[#C47737]/40 animate-ping opacity-40 pointer-events-none" />

          {/* Central circle */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FAF2E9] to-[#F2EAE0] border-2 border-[#C47737] flex items-center justify-center shadow-inner">
            <span
              key={count}
              className={`font-serif font-extrabold text-[#C47737] animate-in zoom-in-75 duration-300 ${
                isGo ? "text-2xl" : "text-5xl"
              }`}
            >
              {isGo ? "Begin! 🙏" : count}
            </span>
          </div>
        </div>

        {/* Instructive Text */}
        <h3 className="text-base font-serif font-bold text-[#3D352D] mt-2">
          {isGo ? "Starting Pradakshina" : "Stand at Point A"}
        </h3>
        <p className="text-xs text-[#7C7267] mt-1 leading-relaxed max-w-[200px]">
          {isGo
            ? "Point A registered! Walk freely in devotion."
            : "Stand still in front of the deity as we lock your start location."}
        </p>

        {/* Cancel Button */}
        {!isGo && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-6 py-1.5 px-4 rounded-xl text-xs font-semibold text-[#7C7267] hover:text-[#3D352D] hover:bg-[#FAF6F0] border border-[#E8DCC8] transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
