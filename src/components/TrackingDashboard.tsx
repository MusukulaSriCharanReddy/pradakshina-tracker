"use client";

import React, { useSyncExternalStore } from "react";
import { TrackingState } from "@/types/session";

interface TrackingDashboardProps {
  count: number;
  target: number;
  state: TrackingState;
}

const emptySubscribe = () => () => {};

export const TrackingDashboard: React.FC<TrackingDashboardProps> = ({
  count,
  target,
  state,
}) => {
  const currentDate = useSyncExternalStore(
    emptySubscribe,
    () =>
      new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    () => ""
  );

  const safeTarget = target > 0 ? target : 1;
  const progressRatio = Math.min(1, Math.max(0, count / safeTarget));
  const percentage = Math.round(progressRatio * 100);
  const remaining = Math.max(0, safeTarget - count);

  // Semicircular Arc Geometry (180deg to 0deg, length = PI * R)
  const radius = 95;
  const arcLength = Math.PI * radius; // ~298.45
  const strokeDashoffset = arcLength * (1 - progressRatio);

  const getStatusSummary = () => {
    switch (state) {
      case "idle":
        return { label: "Ready", color: "text-[#7C7267]" };
      case "waiting-for-departure":
        return { label: "At Start", color: "text-[#C47737]" };
      case "waiting-for-return":
        return { label: "Walking", color: "text-[#2B6CB0]" };
      case "paused":
        return { label: "Paused", color: "text-[#7C7267]" };
      case "completed":
        return { label: "Complete", color: "text-[#2F855A]" };
    }
  };

  const statusSummary = getStatusSummary();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Card Header */}
      <div className="w-full flex items-center justify-between px-1 mb-2 text-xs text-[#7C7267]">
        <span className="font-semibold text-[#3D352D] text-sm tracking-tight">Today&apos;s Pradakshina</span>
        <span className="flex items-center gap-1 font-medium">
          <svg className="w-3.5 h-3.5 text-[#C47737]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {currentDate || "Pradakshina"}
        </span>
      </div>

      {/* Semicircular Arc Counter */}
      <div className="relative w-full max-w-[280px] h-[175px] flex items-center justify-center pt-2">
        <svg viewBox="0 0 240 145" className="w-full h-full overflow-visible">
          <defs>
            {/* Warm saffron gradient for progress */}
            <linearGradient id="saffronGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C47737" />
              <stop offset="50%" stopColor="#D97A32" />
              <stop offset="100%" stopColor="#E28639" />
            </linearGradient>
            {/* Subtle soft drop shadow */}
            <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C47737" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 25,125 A 95,95 0 0,1 215,125"
            fill="none"
            stroke="#F2EAE0"
            strokeWidth="15"
            strokeLinecap="round"
          />

          {/* Foreground Progress Arc */}
          <path
            d="M 25,125 A 95,95 0 0,1 215,125"
            fill="none"
            stroke="url(#saffronGradient)"
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            filter={count > 0 ? "url(#arcGlow)" : undefined}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute top-[52px] left-0 right-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-5xl sm:text-6xl font-bold tracking-tight text-[#3D352D] font-sans">
            {count}
          </span>
          <span className="text-xs sm:text-sm font-medium text-[#7C7267] mt-0.5">
            of {target} rounds
          </span>
        </div>
      </div>

      {/* 4 Mini Metrics Row (Inspired by Mantrum reference) */}
      <div className="grid grid-cols-4 gap-2 w-full mt-2">
        {/* Metric 1: Remaining */}
        <div className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]/60">
          <div className="w-7 h-7 rounded-full bg-[#F2EAE0] flex items-center justify-center text-[#C47737] mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[10px] text-[#7C7267] font-medium">Left</span>
          <span className="text-xs font-bold text-[#3D352D]">{remaining}</span>
        </div>

        {/* Metric 2: Target */}
        <div className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]/60">
          <div className="w-7 h-7 rounded-full bg-[#F2EAE0] flex items-center justify-center text-[#C47737] mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-[10px] text-[#7C7267] font-medium">Target</span>
          <span className="text-xs font-bold text-[#3D352D]">{target}</span>
        </div>

        {/* Metric 3: Goal % */}
        <div className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]/60">
          <div className="w-7 h-7 rounded-full bg-[#F2EAE0] flex items-center justify-center text-[#C47737] mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-[10px] text-[#7C7267] font-medium">Goal</span>
          <span className="text-xs font-bold text-[#3D352D]">{percentage}%</span>
        </div>

        {/* Metric 4: Status */}
        <div className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]/60">
          <div className="w-7 h-7 rounded-full bg-[#F2EAE0] flex items-center justify-center text-[#C47737] mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <span className="text-[10px] text-[#7C7267] font-medium">Status</span>
          <span className={`text-xs font-bold ${statusSummary.color}`}>{statusSummary.label}</span>
        </div>
      </div>
    </div>
  );
};
