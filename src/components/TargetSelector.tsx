"use client";

import React, { useState } from "react";
import { TargetPreset } from "@/types/session";

interface TargetSelectorProps {
  selectedTarget: number;
  onSelectTarget: (target: number) => void;
  disabled?: boolean;
}

const PRESETS: TargetPreset[] = [11, 21, 51, 108];

export const TargetSelector: React.FC<TargetSelectorProps> = ({
  selectedTarget,
  onSelectTarget,
  disabled = false,
}) => {
  const isPreset = PRESETS.includes(selectedTarget as TargetPreset);
  const [isCustomMode, setIsCustomMode] = useState(!isPreset);
  const [customValue, setCustomValue] = useState(
    !isPreset ? String(selectedTarget) : "9"
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
      <div className="flex items-center justify-between px-0.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#7C7267]">
          Target Rounds
        </label>
        <span className="text-xs text-[#7C7267]">
          Target: <strong className="text-[#C47737] font-bold">{selectedTarget}</strong>
        </span>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((preset) => {
          const isSelected = !isCustomMode && selectedTarget === preset;
          return (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              onClick={() => handlePresetClick(preset)}
              className={`py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 border ${
                isSelected
                  ? "bg-[#C47737] text-white border-[#C47737] shadow-sm shadow-[#C47737]/30 scale-[1.02]"
                  : "bg-[#FAF6F0] text-[#3D352D] border-[#E8DCC8] hover:border-[#C47737]/60 hover:bg-[#F2EAE0]"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
            >
              {preset}
            </button>
          );
        })}
      </div>

      {/* Custom Target Input or Toggle */}
      <div className="mt-0.5">
        {!isCustomMode ? (
          <button
            type="button"
            disabled={disabled}
            onClick={handleCustomModeToggle}
            className={`w-full py-2 px-3 text-xs font-medium text-[#7C7267] bg-[#FAF6F0] rounded-xl border border-[#E8DCC8] hover:border-[#C47737]/50 hover:text-[#C47737] transition-colors text-center ${
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
                Reset
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
