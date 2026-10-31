"use client";

import React from "react";

interface ProgressDisplayProps {
  count: number;
  target: number;
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  count,
  target,
}) => {
  const safeTarget = target > 0 ? target : 1;
  const rawPercentage = (count / safeTarget) * 100;
  const percentage = Math.min(100, Math.round(rawPercentage));
  const remaining = Math.max(0, safeTarget - count);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Top summary row */}
      <div className="flex items-center justify-between text-xs font-medium text-stone-600">
        <span>
          Remaining:{" "}
          <strong className="text-stone-900 font-bold">
            {remaining === 0 ? "None (Complete!)" : `${remaining} rounds`}
          </strong>
        </span>
        <span className="font-semibold text-amber-800">{percentage}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

