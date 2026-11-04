"use client";

import React, { useState } from "react";
import { UserSettings, DEFAULT_USER_SETTINGS } from "@/lib/session-storage";
import { soundManager } from "@/lib/audio-chime";

interface SettingsModalProps {
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings: initialSettings,
  onSaveSettings,
  onClose,
}) => {
  const [settings, setSettings] = useState<UserSettings>(initialSettings);

  const handleSave = () => {
    onSaveSettings(settings);
    onClose();
  };

  const handleReset = () => {
    setSettings(DEFAULT_USER_SETTINGS);
  };

  const testBell = () => {
    soundManager.playRoundBell();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-[#E8DCC8] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8]">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <div>
              <h2 className="text-base font-serif font-bold text-[#3D352D]">
                Tracker Settings
              </h2>
              <p className="text-[11px] text-[#7C7267]">
                Configure distance thresholds & sensory feedback
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF6F0] text-[#7C7267] hover:text-[#3D352D] flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-5 pr-1">
          {/* Sensory Feedback Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C47737]">
              Sensory Feedback
            </h3>

            {/* Haptic Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]">
              <div>
                <p className="text-xs font-bold text-[#3D352D]">Palm Vibration (Haptics)</p>
                <p className="text-[11px] text-[#7C7267]">Gentle vibration in hand on each count</p>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticFeedback}
                onChange={(e) => setSettings({ ...settings, hapticFeedback: e.target.checked })}
                className="w-5 h-5 accent-[#C47737] cursor-pointer"
              />
            </div>

            {/* Bell Chime Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-[#3D352D]">Temple Bell Chime</p>
                  <button
                    type="button"
                    onClick={testBell}
                    className="text-[10px] text-[#C47737] hover:underline font-semibold cursor-pointer"
                  >
                    ▶ Test Tone
                  </button>
                </div>
                <p className="text-[11px] text-[#7C7267]">Harmonic singing bell sound on +1 round</p>
              </div>
              <input
                type="checkbox"
                checked={settings.soundChime}
                onChange={(e) => setSettings({ ...settings, soundChime: e.target.checked })}
                className="w-5 h-5 accent-[#C47737] cursor-pointer"
              />
            </div>

            {/* Voice Announcement Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]">
              <div>
                <p className="text-xs font-bold text-[#3D352D]">Spoken Voice Announcement</p>
                <p className="text-[11px] text-[#7C7267]">Speaks round number for hands-free pocket walking</p>
              </div>
              <input
                type="checkbox"
                checked={settings.voiceAnnouncement}
                onChange={(e) => setSettings({ ...settings, voiceAnnouncement: e.target.checked })}
                className="w-5 h-5 accent-[#C47737] cursor-pointer"
              />
            </div>
          </div>

          {/* GPS Thresholds Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C47737]">
              GPS Distance Thresholds
            </h3>

            {/* Departure Radius */}
            <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8] flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3D352D]">Departure Radius</span>
                <span className="text-xs font-bold text-[#C47737]">{settings.departureRadiusMeters} metres</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="1"
                value={settings.departureRadiusMeters}
                onChange={(e) => setSettings({ ...settings, departureRadiusMeters: parseInt(e.target.value, 10) })}
                className="accent-[#C47737] cursor-pointer w-full"
              />
              <p className="text-[10px] text-[#7C7267]">
                Distance you must walk away from Point A to initiate a round. Use 12–15m for small shrines, 20m for typical temples.
              </p>
            </div>

            {/* Return Radius */}
            <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8] flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3D352D]">Return Radius</span>
                <span className="text-xs font-bold text-[#C47737]">{settings.returnRadiusMeters} metres</span>
              </div>
              <input
                type="range"
                min="4"
                max="15"
                step="1"
                value={settings.returnRadiusMeters}
                onChange={(e) => setSettings({ ...settings, returnRadiusMeters: parseInt(e.target.value, 10) })}
                className="accent-[#C47737] cursor-pointer w-full"
              />
              <p className="text-[10px] text-[#7C7267]">
                Distance to Point A required to trigger count +1. Default is 8m.
              </p>
            </div>

            {/* Accuracy Limit */}
            <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8] flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3D352D]">Max GPS Error Filter</span>
                <span className="text-xs font-bold text-[#C47737]">±{settings.maxAccuracyThresholdMeters} metres</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={settings.maxAccuracyThresholdMeters}
                onChange={(e) => setSettings({ ...settings, maxAccuracyThresholdMeters: parseInt(e.target.value, 10) })}
                className="accent-[#C47737] cursor-pointer w-full"
              />
              <p className="text-[10px] text-[#7C7267]">
                Readings with GPS error larger than this are ignored to prevent false jumps.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E8DCC8] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#7C7267] hover:text-[#3D352D] underline cursor-pointer"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-5 rounded-2xl bg-[#C47737] text-white text-xs font-bold hover:opacity-95 shadow-sm cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

