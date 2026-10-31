"use client";

import React from "react";
import { TrackingMode, LocationPoint } from "@/types/session";
import { LocationError } from "@/lib/location-provider";

interface GpsIndicatorProps {
  mode: TrackingMode;
  onToggleMode: (newMode: TrackingMode) => void;
  isSessionActive: boolean;
  currentLocation: LocationPoint | null;
  locationError: LocationError | null;
}

export const GpsIndicator: React.FC<GpsIndicatorProps> = ({
  mode,
  onToggleMode,
  isSessionActive,
  currentLocation,
  locationError,
}) => {
  const getAccuracyQuality = (accuracy: number) => {
    if (accuracy <= 8) return { label: "Strong", color: "text-[#2F855A]", dot: "bg-[#2F855A]" };
    if (accuracy <= 15) return { label: "Good", color: "text-[#C47737]", dot: "bg-[#C47737]" };
    if (accuracy <= 20) return { label: "Moderate", color: "text-[#D69E2E]", dot: "bg-[#D69E2E]" };
    return { label: "Weak (Filtered)", color: "text-[#E53E3E]", dot: "bg-[#E53E3E]" };
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Mode Switcher & Status Bar */}
      <div className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]">
        {/* Left: Mode Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isSessionActive}
            onClick={() => onToggleMode("gps")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              mode === "gps"
                ? "bg-[#C47737] text-white shadow-xs"
                : "text-[#7C7267] hover:text-[#3D352D]"
            } ${isSessionActive ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            🛰️ Real GPS
          </button>

          <button
            type="button"
            disabled={isSessionActive}
            onClick={() => onToggleMode("simulated")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              mode === "simulated"
                ? "bg-[#C47737] text-white shadow-xs"
                : "text-[#7C7267] hover:text-[#3D352D]"
            } ${isSessionActive ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            🎮 Simulator
          </button>
        </div>

        {/* Right: GPS Accuracy / Status Pill */}
        <div className="flex items-center gap-1.5 text-xs">
          {mode === "gps" ? (
            currentLocation ? (
              (() => {
                const quality = getAccuracyQuality(currentLocation.accuracy);
                return (
                  <div className="flex items-center gap-1.5 font-medium text-[11px] text-[#3D352D]">
                    <span className={`w-2 h-2 rounded-full ${quality.dot} animate-pulse`} />
                    <span>±{Math.round(currentLocation.accuracy)}m</span>
                    <span className={`text-[10px] ${quality.color}`}>({quality.label})</span>
                  </div>
                );
              })()
            ) : isSessionActive ? (
              <div className="flex items-center gap-1 text-[11px] text-[#C47737]">
                <span className="w-2 h-2 rounded-full bg-[#C47737] animate-ping" />
                <span>Acquiring fix...</span>
              </div>
            ) : (
              <span className="text-[11px] text-[#7C7267]">GPS Ready</span>
            )
          ) : (
            <span className="text-[11px] text-[#C47737] font-medium bg-[#C47737]/10 px-2 py-0.5 rounded-full">
              Simulated Mode
            </span>
          )}
        </div>
      </div>

      {/* Permission or GPS Error Banner */}
      {locationError && (
        <div className="w-full p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FEB2B2] text-left text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#9B2C2C] mb-1">
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{locationError.message}</span>
          </div>
          <p className="text-[#7C7267] text-[11px] leading-relaxed">
            {locationError.userGuidance}
          </p>
        </div>
      )}
    </div>
  );
};

