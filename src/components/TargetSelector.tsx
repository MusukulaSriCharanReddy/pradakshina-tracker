"use client";

import React, { useState } from "react";
import { TargetPreset } from "@/types/session";

interface TargetSelectorProps {
  selectedTarget: number;
  onSelectTarget: (target: number) => void;
  disabled?: boolean;
}

export interface TemplePresetInfo {
  count: TargetPreset;
  label: string;
  tradition: string;
}

export const TEMPLE_PRESETS: TemplePresetInfo[] = [
  { count: 3, label: "Ganesha", tradition: "Temple Minimum / Vinayaka" },
  { count: 9, label: "Navagraha", tradition: "Nine Cosmic Planets" },
  { count: 11, label: "Rudra", tradition: "Lord Shiva / Ekadasha" },
  { count: 21, label: "Devi / Vrata", tradition: "Goddess & Sankashti" },
  { count: 51, label: "Shakti", tradition: "Shakti Peetha Sankalpa" },
  { count: 108, label: "Maha Mala", tradition: "Full Sacred Circumambulation" },
];

export const TargetSelector: React.FC<TargetSelectorProps> = ({
  selectedTarget,
  onSelectTarget,
  disabled = false,
}) => {
  const activePreset = TEMPLE_PRESETS.find((p) => p.count === selectedTarget);
  const isPreset = !!activePreset;
  const [isCustomMode, setIsCustomMode] = useState(!isPreset);
  const [customValue, setCustomValue] = useState(
    !isPreset ? String(selectedTarget) : "108"
  );
  const [error, setError] = useState<string | null>(null);

  const handlePresetClick = (preset: TargetPreset) => {
    if (disabled) return;
    setIsCustomMode(false);
    setError(null);
    onSelectTarget(preset);
  };

  const handleCustomModeToggle = () => {
    if (disabled) return;
    setIsCustomMode(true);
    const parsed = parseInt(customValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setError(null);
      onSelectTarget(parsed);
    } else {
      setError("Please enter a valid positive number");
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomValue(val);
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Enter a number > 0");
    } else if (parsed > 10000) {
      setError("Maximum target is 10,000");
    } else {
      setError(null);
      onSelectTarget(parsed);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Target Header with Tradition Context */}
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#7C7267]">
          Target Rounds
        </label>
        <span className="text-xs text-[#7C7267] truncate max-w-[240px] text-right">
          Target:{" "}
          <strong className="text-[#C47737] font-bold">
            {selectedTarget}
          </strong>
          {activePreset && (
            <span className="ml-1 text-[11px] text-[#7C7267] font-normal hidden xs:inline">
              ({activePreset.label})
            </span>
          )}
        </span>
      </div>

      {/* Temple Ritual Presets Grid (2 rows x 3 columns) */}
      <div className="grid grid-cols-3 gap-2">
        {TEMPLE_PRESETS.map((preset) => {
          const isSelected = !isCustomMode && selectedTarget === preset.count;
          return (
            <button
              key={preset.count}
              type="button"
              disabled={disabled}
              onClick={() => handlePresetClick(preset.count)}
              className={`py-2 px-1.5 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border ${
                isSelected
                  ? "bg-[#C47737] text-white border-[#C47737] shadow-sm shadow-[#C47737]/30 scale-[1.02]"
                  : "bg-[#FAF6F0] text-[#3D352D] border-[#E8DCC8] hover:border-[#C47737]/60 hover:bg-[#F2EAE0]"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
            >
              <span className="text-base font-bold font-serif leading-tight">
                {preset.count}
              </span>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 ${
                  isSelected ? "text-white/90" : "text-[#7C7267]"
                }`}
              >
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Preset Tradition Hint */}
      {activePreset && !isCustomMode && (
        <p className="text-[11px] text-[#7C7267] italic text-center px-1 -mt-1">
          {activePreset.tradition}
        </p>
      )}

      {/* Custom Target Input or Toggle */}
      <div className="mt-0.5">
        {!isCustomMode ? (
          <button
            type="button"
            disabled={disabled}
            onClick={handleCustomModeToggle}
            className={`w-full py-1.5 px-3 text-xs font-medium text-[#7C7267] bg-[#FAF6F0] rounded-xl border border-[#E8DCC8] hover:border-[#C47737]/50 hover:text-[#C47737] transition-colors text-center ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            + Custom Target Count
          </button>
        ) : (
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#FAF2E9] border border-[#E8DCC8]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#3D352D] shrink-0">
                Custom rounds:
              </span>
              <input
                type="number"
                min="1"
                max="10000"
                disabled={disabled}
                value={customValue}
                onChange={handleCustomChange}
                placeholder="e.g. 108"
                className="w-full px-3 py-1.5 text-sm font-semibold bg-white border border-[#E8DCC8] rounded-xl text-[#3D352D] focus:outline-none focus:ring-2 focus:ring-[#C47737]"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() => handlePresetClick(108)}
                className="text-xs text-[#7C7267] hover:text-[#3D352D] underline px-1 shrink-0"
              >
                Presets
              </button>
            </div>
            {error && (
              <p className="text-[11px] text-red-600 font-medium">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
