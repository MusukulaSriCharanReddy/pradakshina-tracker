"use client";

import React from "react";
import { TrackingState } from "@/types/session";

interface TrackingStatusProps {
  state: TrackingState;
}

export const TrackingStatus: React.FC<TrackingStatusProps> = ({ state }) => {
  const getStatusConfig = () => {
    switch (state) {
      case "idle":
        return {
          title: "Ready to Begin",
          subtitle: "Stand at your starting spot (Point A) and tap Start.",
          bgColor: "bg-[#FAF6F0]",
          borderColor: "border-[#E8DCC8]",
          dotColor: "bg-[#A89F91]",
          textColor: "text-[#3D352D]",
          badgeBg: "bg-[#E8DCC8]/50 text-[#7C7267]",
        };
      case "waiting-for-departure":
        return {
          title: "At Starting Area",
          subtitle: "Walk away from Point A to commence your circumambulation.",
          bgColor: "bg-[#FAF2E9]",
          borderColor: "border-[#E8DCC8]",
          dotColor: "bg-[#C47737] animate-pulse",
          textColor: "text-[#3D352D]",
          badgeBg: "bg-[#C47737]/15 text-[#C47737]",
        };
      case "waiting-for-return":
        return {
          title: "Walking Freely",
          subtitle: "Take any path around. Count +1 triggers upon your return to Point A.",
          bgColor: "bg-[#F0F5FA]",
          borderColor: "border-[#D0E1F2]",
          dotColor: "bg-[#2B6CB0] animate-pulse",
          textColor: "text-[#1A365D]",
          badgeBg: "bg-[#2B6CB0]/15 text-[#2B6CB0]",
        };
      case "paused":
        return {
          title: "Pradakshina Paused",
          subtitle: "Counter paused. Tap Resume whenever you are ready to continue.",
          bgColor: "bg-[#F5F2EB]",
          borderColor: "border-[#E8DCC8]",
          dotColor: "bg-[#7C7267]",
          textColor: "text-[#3D352D]",
          badgeBg: "bg-[#7C7267]/15 text-[#7C7267]",
        };
      case "completed":
        return {
          title: "Target Completed 🙏",
          subtitle: "All pradakshina rounds completed with devotion and peace.",
          bgColor: "bg-[#F0F7F4]",
          borderColor: "border-[#CCE7DC]",
          dotColor: "bg-[#2F855A]",
          textColor: "text-[#1C4532]",
          badgeBg: "bg-[#2F855A]/15 text-[#2F855A]",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`w-full p-3.5 rounded-2xl border ${config.borderColor} ${config.bgColor} transition-all duration-300 flex items-center gap-3 text-left shadow-xs`}
    >
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dotColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${config.textColor}`}>
            {config.title}
          </span>
        </div>
        <p className="text-[11px] text-[#7C7267] truncate mt-0.5">
          {config.subtitle}
        </p>
      </div>
    </div>
  );
};
