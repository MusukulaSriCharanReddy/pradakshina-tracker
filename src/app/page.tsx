"use client";

import React, { useState } from "react";
import { TargetSelector } from "@/components/TargetSelector";
import { TrackingDashboard } from "@/components/TrackingDashboard";
import { TrackingStatus } from "@/components/TrackingStatus";
import { SessionControls } from "@/components/SessionControls";
import { GpsIndicator } from "@/components/GpsIndicator";
import { SimulationControls } from "@/components/SimulationControls";
import { SessionSummaryModal } from "@/components/SessionSummaryModal";
import { SessionHistoryView } from "@/components/SessionHistoryView";
import { SettingsModal } from "@/components/SettingsModal";
import { CountdownOverlay } from "@/components/CountdownOverlay";
import { PocketModeOverlay } from "@/components/PocketModeOverlay";
import { usePradakshinaSession } from "@/hooks/use-pradakshina-session";

export default function Home() {
  const {
    target,
    count,
    state,
    mode,
    currentLocation,
    locationError,
    logMessages,
    settings,
    completedSummary,
    showHistoryModal,
    showSettingsModal,
    countdown,
    setShowHistoryModal,
    setShowSettingsModal,
    clearCompletedSummary,
    updateSettings,
    selectTarget,
    setMode,
    startWithCountdown,
    cancelCountdown,
    pauseSession,
    resumeSession,
    endSession,
    simulateDeparture,
    simulateReturn,
    simulateStayAtStart,
    simulateCompleteCycle,
  } = usePradakshinaSession();

  const [showDevotionModal, setShowDevotionModal] = useState(false);
  const [isPocketMode, setIsPocketMode] = useState(false);
  const isSessionActive = state !== "idle";

  return (
    <div className="min-h-screen bg-[#F7F1E6] text-[#3D352D] flex flex-col justify-between selection:bg-[#E8DCC8]">
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 max-w-md mx-auto w-full">
        {/* Top Header (Warm & Devotional) */}
        <header className="w-full text-center pt-2 pb-3 flex flex-col items-center">
          {/* Spiritual Symbol / Lotus Motif */}
          <div className="w-12 h-12 rounded-full bg-[#FAF2E9] border border-[#E8DCC8] flex items-center justify-center text-[#C47737] shadow-xs mb-2">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C12.5 4 14 6.5 16 8C14 8.5 12.5 10 12 12C11.5 10 10 8.5 8 8C10 6.5 11.5 4 12 2Z" />
              <path d="M12 12C13.5 13.5 16.5 14.5 19 14C17.5 15.5 15 16.5 13.5 18C13 16 12.5 14 12 12Z" opacity="0.8" />
              <path d="M12 12C10.5 13.5 7.5 14.5 5 14C6.5 15.5 9 16.5 10.5 18C11 16 11.5 14 12 12Z" opacity="0.8" />
              <path d="M12 18.5C14 19 16 20.5 17 22C15 22 13 21 12 20C11 21 9 22 7 22C8 20.5 10 19 12 18.5Z" opacity="0.9" />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#3D352D] tracking-tight">
            Pradakshina
          </h1>
          <p className="text-xs text-[#7C7267] font-medium tracking-wide mt-0.5">
            Devotional Circumambulation Counter
          </p>

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-2 my-2 opacity-60">
            <span className="w-8 h-px bg-[#C47737]/40" />
            <span className="text-[#C47737] text-[10px]">✤</span>
            <span className="w-8 h-px bg-[#C47737]/40" />
          </div>
        </header>

        {/* GPS Mode & Accuracy Banner */}
        <div className="w-full mb-3">
          <GpsIndicator
            mode={mode}
            onToggleMode={setMode}
            isSessionActive={isSessionActive}
            currentLocation={currentLocation}
            locationError={locationError}
          />
        </div>

        {/* Main Devotional Card */}
        <section className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E8DCC8]/70 flex flex-col gap-5">
          {/* Target Selector */}
          <TargetSelector
            selectedTarget={target}
            onSelectTarget={selectTarget}
            disabled={isSessionActive && state !== "completed"}
          />

          {/* Circular / Arc Tracking Dashboard */}
          <TrackingDashboard count={count} target={target} state={state} />

          {/* Tracking Status Indicator */}
          <TrackingStatus state={state} />

          {/* Primary Session Controls */}
          <SessionControls
            state={state}
            onStart={startWithCountdown}
            onPause={pauseSession}
            onResume={resumeSession}
            onEnd={() => {
              setIsPocketMode(false);
              endSession();
            }}
            onEnterPocketMode={() => setIsPocketMode(true)}
          />
        </section>

        {/* Peaceful Invariant Note */}
        <section className="w-full mt-3 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8]/80 text-center shadow-xs">
          <p className="text-xs font-serif italic text-[#3D352D]">
            &ldquo;Start at Point A → Leave Point A → Return to Point A = Count +1&rdquo;
          </p>
          <p className="text-[11px] text-[#7C7267] mt-0.5">
            Walk any path or direction in mindful devotion.
          </p>
        </section>

        {/* Simulation Controls (Available in Simulator Mode) */}
        {mode === "simulated" && (
          <SimulationControls
            state={state}
            onSimulateDeparture={simulateDeparture}
            onSimulateReturn={simulateReturn}
            onSimulateStayAtStart={simulateStayAtStart}
            onSimulateCompleteCycle={simulateCompleteCycle}
            logMessages={logMessages}
          />
        )}

        {/* Live Event Log in GPS Mode */}
        {mode === "gps" && isSessionActive && logMessages.length > 0 && (
          <div className="w-full bg-[#FAF6F0] rounded-2xl p-3 border border-[#E8DCC8] text-[11px] font-mono mt-3">
            <div className="text-[#7C7267] font-semibold text-[10px] uppercase mb-1">
              Live GPS Activity Log
            </div>
            <div className="flex flex-col gap-1 max-h-20 overflow-y-auto pr-1">
              {logMessages.slice(0, 5).map((log, index) => (
                <span
                  key={index}
                  className={index === 0 ? "text-[#C47737] font-medium" : "text-[#5A5147]"}
                >
                  › {log}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Devotional Bottom Navigation */}
      <nav className="w-full bg-white/95 backdrop-blur-md border-t border-[#E8DCC8] py-2 px-6 sticky bottom-0 z-40">
        <div className="max-w-md mx-auto flex items-center justify-around text-center">
          {/* Tab 1: Counter */}
          <button
            type="button"
            onClick={() => {
              setShowHistoryModal(false);
              setShowSettingsModal(false);
              setShowDevotionModal(false);
            }}
            className="flex flex-col items-center text-[#C47737] cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-[10px] font-semibold mt-0.5">Counter</span>
          </button>

          {/* Tab 2: Devotion / Mantras */}
          <button
            type="button"
            onClick={() => setShowDevotionModal(true)}
            className="flex flex-col items-center text-[#7C7267] hover:text-[#3D352D] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-[10px] font-medium mt-0.5">Devotion</span>
          </button>

          {/* Tab 3: History */}
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="flex flex-col items-center text-[#7C7267] hover:text-[#3D352D] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-[10px] font-medium mt-0.5">History</span>
          </button>

          {/* Tab 4: Settings */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="flex flex-col items-center text-[#7C7267] hover:text-[#3D352D] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-medium mt-0.5">Settings</span>
          </button>
        </div>
      </nav>

      {/* Completion / Session Summary Modal */}
      {completedSummary && (
        <SessionSummaryModal
          summary={completedSummary}
          onNewSession={() => {
            clearCompletedSummary();
            startWithCountdown();
          }}
          onViewHistory={() => {
            clearCompletedSummary();
            setShowHistoryModal(true);
          }}
          onClose={clearCompletedSummary}
        />
      )}

      {/* 3-2-1 Countdown Overlay */}
      {countdown !== null && (
        <CountdownOverlay count={countdown} onCancel={cancelCountdown} />
      )}

      {/* Pocket-Safe Ambient Mode Overlay */}
      {isPocketMode && isSessionActive && (
        <PocketModeOverlay
          count={count}
          target={target}
          state={state}
          mode={mode}
          voiceEnabled={!!settings.voiceAnnouncement}
          onToggleVoice={() =>
            updateSettings({
              ...settings,
              voiceAnnouncement: !settings.voiceAnnouncement,
            })
          }
          onExitPocketMode={() => setIsPocketMode(false)}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <SessionHistoryView onClose={() => setShowHistoryModal(false)} />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onSaveSettings={updateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Devotion / Sacred Chants Modal */}
      {showDevotionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-[#E8DCC8] flex flex-col text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF2E9] border border-[#E8DCC8] flex items-center justify-center text-[#C47737] mx-auto mb-3">
              <span className="text-xl">🪷</span>
            </div>
            <h2 className="text-base font-serif font-bold text-[#3D352D] mb-1">
              Pradakshina Shloka
            </h2>
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DCC8] my-3 text-xs font-serif leading-relaxed text-[#3D352D]">
              <p className="font-semibold text-sm mb-1 text-[#C47737]">
                यत्किञ्चित् पापं मया कृतम् ।<br />
                तानि सर्वाणि नश्यन्ति प्रदक्षिण पदे पदे ॥
              </p>
              <p className="text-[11px] text-[#7C7267] mt-2 italic">
                &ldquo;Whatever transgressions or impurities may have occurred, may they all be dissolved step by step with every circumambulation.&rdquo;
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDevotionModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#C47737] text-white text-xs font-bold hover:opacity-95 cursor-pointer mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
