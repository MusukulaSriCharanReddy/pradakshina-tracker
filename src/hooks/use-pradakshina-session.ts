"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TrackingState, TrackingMode, LocationPoint } from "@/types/session";
import { PradakshinaCountingEngine } from "@/lib/counting-engine";
import { calculateDestinationPoint } from "@/lib/geo-utils";
import { BrowserLocationProvider, LocationError } from "@/lib/location-provider";
import {
  ActiveSessionData,
  UserSettings,
  loadUserSettings,
  saveUserSettings,
  CompletedSessionRecord,
  saveCompletedSession,
  saveActiveSession,
  loadActiveSession,
  clearActiveSession,
} from "@/lib/session-storage";
import { soundManager } from "@/lib/audio-chime";

export interface UsePradakshinaSessionReturn {
  target: number;
  count: number;
  state: TrackingState;
  mode: TrackingMode;
  startPoint: LocationPoint | null;
  currentLocation: LocationPoint | null;
  locationError: LocationError | null;
  logMessages: string[];
  settings: UserSettings;
  completedSummary: CompletedSessionRecord | null;
  showHistoryModal: boolean;
  showSettingsModal: boolean;
  countdown: number | null;
  setShowHistoryModal: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  clearCompletedSummary: () => void;
  updateSettings: (newSettings: UserSettings) => void;
  selectTarget: (target: number) => void;
  setMode: (mode: TrackingMode) => void;
  startSession: () => Promise<void>;
  startWithCountdown: () => void;
  cancelCountdown: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  simulateDeparture: () => void;
  simulateReturn: () => void;
  simulateStayAtStart: () => void;
  simulateCompleteCycle: () => void;
}

const DEFAULT_SIMULATED_START: LocationPoint = {
  latitude: 12.9716,
  longitude: 77.5946,
  accuracy: 4.5,
  timestamp: 0,
};

export function usePradakshinaSession(): UsePradakshinaSessionReturn {
  const [initialActiveSession] = useState<ActiveSessionData | null>(() => loadActiveSession());

  const [target, setTarget] = useState<number>(() => initialActiveSession?.target ?? 108);
  const [count, setCount] = useState<number>(() => initialActiveSession?.count ?? 0);
  const [state, setState] = useState<TrackingState>(() => initialActiveSession?.state ?? "idle");
  const [mode, setMode] = useState<TrackingMode>(() => initialActiveSession?.mode ?? "gps");
  const [startPoint, setStartPoint] = useState<LocationPoint | null>(() => initialActiveSession?.startPoint ?? null);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(() => initialActiveSession?.startPoint ?? null);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>(() =>
    initialActiveSession
      ? [`Restored active session: ${initialActiveSession.count}/${initialActiveSession.target} rounds.`]
      : []
  );
  const [settings, setSettings] = useState<UserSettings>(() => loadUserSettings());
  const [completedSummary, setCompletedSummary] = useState<CompletedSessionRecord | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const countdownTimersRef = useRef<NodeJS.Timeout[]>([]);
  const sessionStartTimeRef = useRef<number>(initialActiveSession?.startedAt ?? 0);
  const engineRef = useRef<PradakshinaCountingEngine>(
    new PradakshinaCountingEngine({
      departureRadiusMeters: settings.departureRadiusMeters,
      returnRadiusMeters: settings.returnRadiusMeters,
      maxAccuracyThresholdMeters: settings.maxAccuracyThresholdMeters,
    })
  );
  const locationProviderRef = useRef<BrowserLocationProvider>(new BrowserLocationProvider());
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Sync settings changes into the Counting Engine
  const updateSettings = useCallback((newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
    engineRef.current.setConfig({
      departureRadiusMeters: newSettings.departureRadiusMeters,
      returnRadiusMeters: newSettings.returnRadiusMeters,
      maxAccuracyThresholdMeters: newSettings.maxAccuracyThresholdMeters,
    });
  }, []);

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogMessages((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 24)]);
  }, []);

  // Screen Wake Lock
  const acquireWakeLock = useCallback(async () => {
    if (typeof window !== "undefined" && "wakeLock" in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // Ignored
      }
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  }, []);

  // Sensory feedback (haptic vibration + bell chime + voice)
  const triggerFeedback = useCallback(
    (type: "round" | "complete", currentRound?: number) => {
      // Haptics
      if (settings.hapticFeedback && typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          if (type === "round") {
            navigator.vibrate(120);
          } else if (type === "complete") {
            navigator.vibrate([150, 80, 150, 80, 300]);
          }
        } catch {
          // Ignored
        }
      }

      // Temple Bell Chime
      if (settings.soundChime) {
        if (type === "round") {
          soundManager.playRoundBell();
        } else if (type === "complete") {
          soundManager.playCompletionChime();
        }
      }

      // Voice Announcement (for pocket-safe hands-free walking)
      if (settings.voiceAnnouncement && currentRound !== undefined) {
        soundManager.speakRoundCount(currentRound, target);
      }
    },
    [settings.hapticFeedback, settings.soundChime, settings.voiceAnnouncement, target]
  );

  // Synchronize engine if active session was restored
  useEffect(() => {
    if (initialActiveSession?.startPoint) {
      engineRef.current.start(initialActiveSession.startPoint, initialActiveSession.target);
    }
  }, [initialActiveSession]);

  // Persist active session changes
  useEffect(() => {
    if (state === "waiting-for-departure" || state === "waiting-for-return" || state === "paused") {
      saveActiveSession({
        id: `session_${sessionStartTimeRef.current}`,
        target,
        count,
        startPoint,
        state,
        mode,
        startedAt: sessionStartTimeRef.current,
        updatedAt: Date.now(),
        totalDistanceMeters: count * (settings.departureRadiusMeters * 2.5),
      });
    } else if (state === "idle" || state === "completed") {
      clearActiveSession();
    }
  }, [state, count, target, startPoint, mode, settings.departureRadiusMeters]);

  const selectTarget = useCallback(
    (newTarget: number) => {
      if (state !== "idle" && state !== "completed") return;
      setTarget(newTarget);
    },
    [state]
  );

  const handleToggleMode = useCallback(
    (newMode: TrackingMode) => {
      if (state !== "idle" && state !== "completed") return;
      setMode(newMode);
      setLocationError(null);
      addLog(`Tracking mode switched to ${newMode === "gps" ? "Real GPS" : "Simulator"}.`);
    },
    [state, addLog]
  );

  const recordCompletion = useCallback(
    (finalCount: number) => {
      const durationSeconds = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
      const approxDistance = Math.round(finalCount * (settings.departureRadiusMeters * 2.5));

      const record: CompletedSessionRecord = {
        id: `session_${Date.now()}`,
        date: new Date().toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        startedAt: sessionStartTimeRef.current,
        endedAt: Date.now(),
        durationSeconds,
        targetRounds: target,
        completedRounds: finalCount,
        approximateDistanceMeters: approxDistance,
        mode,
      };

      saveCompletedSession(record);
      setCompletedSummary(record);
      clearActiveSession();
    },
    [target, mode, settings.departureRadiusMeters]
  );

  const startSession = useCallback(async () => {
    setLocationError(null);
    setCompletedSummary(null);
    sessionStartTimeRef.current = Date.now();
    const engine = engineRef.current;

    if (mode === "gps") {
      try {
        addLog("Locking GPS fix for starting location (Point A)...");
        const initialGps = await locationProviderRef.current.getCurrentPosition();

        if (initialGps.accuracy > settings.maxAccuracyThresholdMeters) {
          addLog(`Warning: Initial GPS accuracy is ±${Math.round(initialGps.accuracy)}m. Waiting for stronger satellite fix...`);
        }

        const res = engine.start(initialGps, target);
        setStartPoint(initialGps);
        setCurrentLocation(initialGps);
        setCount(res.count);
        setState(res.state);

        acquireWakeLock();

        addLog(
          `Point A registered via GPS (${initialGps.latitude.toFixed(5)}, ${initialGps.longitude.toFixed(
            5
          )}) with accuracy ±${Math.round(initialGps.accuracy)}m. Walk away (>${settings.departureRadiusMeters}m) to start round.`
        );

        locationProviderRef.current.start(
          (point) => {
            setCurrentLocation(point);
            const processRes = engine.processLocation(point);
            setState(processRes.state);
            setCount(processRes.count);

            if (processRes.event === "DEPARTURE_DETECTED") {
              addLog(
                `GPS: Left Point A (${Math.round(processRes.distanceToStartMeters || 0)}m away). Walking round. Return to count.`
              );
            } else if (processRes.event === "RETURN_DETECTED") {
              triggerFeedback("round", processRes.count);
              addLog(
                `GPS: Returned to Point A (${Math.round(processRes.distanceToStartMeters || 0)}m). Count +1 (${processRes.count}/${target}).`
              );
            } else if (processRes.event === "TARGET_COMPLETED") {
              triggerFeedback("complete", processRes.count);
              releaseWakeLock();
              locationProviderRef.current.stop();
              recordCompletion(processRes.count);
              addLog(`GPS: Target of ${target} completed! 🙏`);
            } else if (processRes.event === "READING_REJECTED_ACCURACY") {
              addLog(`GPS: Reading ignored (Accuracy ±${Math.round(point.accuracy)}m is worse than ${settings.maxAccuracyThresholdMeters}m threshold).`);
            }
          },
          (error) => {
            setLocationError(error);
            addLog(`GPS Error: ${error.message} - ${error.userGuidance}`);
          }
        );
      } catch (err) {
        const error = err as LocationError;
        setLocationError(error);
        addLog(`Cannot start GPS session: ${error.message || "Location request failed."}`);
      }
    } else {
      // Simulator Mode
      const initialPoint: LocationPoint = {
        ...DEFAULT_SIMULATED_START,
        timestamp: Date.now(),
      };
      const res = engine.start(initialPoint, target);
      setStartPoint(initialPoint);
      setCurrentLocation(initialPoint);
      setCount(res.count);
      setState(res.state);
      acquireWakeLock();

      addLog(
        `Simulator session started. Point A at (${initialPoint.latitude.toFixed(4)}, ${initialPoint.longitude.toFixed(
          4
        )}). Target: ${target}. Waiting to depart (>${settings.departureRadiusMeters}m).`
      );
    }
  }, [mode, target, settings.maxAccuracyThresholdMeters, settings.departureRadiusMeters, addLog, acquireWakeLock, triggerFeedback, releaseWakeLock, recordCompletion]);

  // Cancel Countdown
  const cancelCountdown = useCallback(() => {
    countdownTimersRef.current.forEach((t) => clearTimeout(t));
    countdownTimersRef.current = [];
    setCountdown(null);
    addLog("Start cancelled.");
  }, [addLog]);

  // 3, 2, 1 Countdown before starting session
  const startWithCountdown = useCallback(() => {
    if (countdown !== null) return;
    countdownTimersRef.current.forEach((t) => clearTimeout(t));
    countdownTimersRef.current = [];

    setCountdown(3);
    if (settings.soundChime) soundManager.playCountdownTick(3);
    if (settings.hapticFeedback && typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(60); } catch {}
    }

    const t1 = setTimeout(() => {
      setCountdown(2);
      if (settings.soundChime) soundManager.playCountdownTick(2);
      if (settings.hapticFeedback && typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(60); } catch {}
      }
    }, 1000);

    const t2 = setTimeout(() => {
      setCountdown(1);
      if (settings.soundChime) soundManager.playCountdownTick(1);
      if (settings.hapticFeedback && typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(60); } catch {}
      }
    }, 2000);

    const t3 = setTimeout(() => {
      setCountdown(0); // "Begin! 🙏"
      if (settings.soundChime) soundManager.playRoundBell();
      if (settings.hapticFeedback && typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate([100, 50, 100]); } catch {}
      }
    }, 3000);

    const t4 = setTimeout(() => {
      setCountdown(null);
      startSession();
    }, 3700);

    countdownTimersRef.current = [t1, t2, t3, t4];
  }, [countdown, settings.soundChime, settings.hapticFeedback, startSession]);

  const pauseSession = useCallback(() => {
    const engine = engineRef.current;
    engine.pause();
    releaseWakeLock();
    setState(engine.getState());
    addLog("Tracking paused. Location updates will not count rounds while paused.");
  }, [addLog, releaseWakeLock]);

  const resumeSession = useCallback(() => {
    const engine = engineRef.current;
    engine.resume();
    acquireWakeLock();
    setState(engine.getState());
    addLog(`Tracking resumed. Current status: ${engine.getState()}.`);
  }, [addLog, acquireWakeLock]);

  const endSession = useCallback(() => {
    const engine = engineRef.current;
    const finalCount = count;
    engine.end();
    locationProviderRef.current.stop();
    releaseWakeLock();
    clearActiveSession();

    if (finalCount > 0) {
      recordCompletion(finalCount);
    }

    setState("idle");
    setCount(0);
    setStartPoint(null);
    setCurrentLocation(null);
    setLocationError(null);
    addLog("Session ended. Tracking stopped.");
  }, [count, addLog, releaseWakeLock, recordCompletion]);

  // Cleanup on unmount
  useEffect(() => {
    const provider = locationProviderRef.current;
    return () => {
      provider.stop();
      releaseWakeLock();
      countdownTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, [releaseWakeLock]);

  const simulateDeparture = useCallback(() => {
    const engine = engineRef.current;
    const basePoint = startPoint || DEFAULT_SIMULATED_START;

    const departedCoord = calculateDestinationPoint(basePoint, settings.departureRadiusMeters + 5, 90);
    const point: LocationPoint = {
      ...departedCoord,
      accuracy: 5.0,
      timestamp: Date.now(),
    };

    setCurrentLocation(point);
    const res = engine.processLocation(point);
    setState(res.state);
    setCount(res.count);

    if (res.event === "DEPARTURE_DETECTED") {
      addLog(
        `Left Point A (Simulated distance: ${Math.round(
          res.distanceToStartMeters || (settings.departureRadiusMeters + 5)
        )}m > ${settings.departureRadiusMeters}m). Walking round. Now waiting for return.`
      );
    } else {
      addLog(`Departure not triggered: ${res.rejectionReason || res.event}`);
    }
  }, [startPoint, settings.departureRadiusMeters, addLog]);

  const simulateReturn = useCallback(() => {
    const engine = engineRef.current;
    const basePoint = startPoint || DEFAULT_SIMULATED_START;

    const returnedCoord = calculateDestinationPoint(basePoint, Math.max(2, settings.returnRadiusMeters - 4), 0);
    const point: LocationPoint = {
      ...returnedCoord,
      accuracy: 4.0,
      timestamp: Date.now(),
    };

    setCurrentLocation(point);
    const res = engine.processLocation(point);
    setState(res.state);
    setCount(res.count);

    if (res.event === "RETURN_DETECTED") {
      triggerFeedback("round", res.count);
      addLog(
        `Returned to Point A! Distance: ${Math.round(
          res.distanceToStartMeters || 4
        )}m (<${settings.returnRadiusMeters}m). Count +1 (${res.count}/${target}). Waiting for next departure.`
      );
    } else if (res.event === "TARGET_COMPLETED") {
      triggerFeedback("complete", res.count);
      releaseWakeLock();
      recordCompletion(res.count);
      addLog(
        `Returned to Point A! Count +1 (${res.count}/${target}). Target reached! All rounds completed 🙏`
      );
    } else if (res.event === "STAY_AT_START") {
      addLog(
        `Ignored: Already at Point A (${Math.round(
          res.distanceToStartMeters || 0
        )}m). You must depart before a return counts.`
      );
    } else {
      addLog(`Return ignored: ${res.rejectionReason || res.event}`);
    }
  }, [startPoint, target, settings.returnRadiusMeters, addLog, triggerFeedback, releaseWakeLock, recordCompletion]);

  const simulateStayAtStart = useCallback(() => {
    const engine = engineRef.current;
    const basePoint = startPoint || DEFAULT_SIMULATED_START;

    const jitterCoord = calculateDestinationPoint(basePoint, 3, 180);
    const point: LocationPoint = {
      ...jitterCoord,
      accuracy: 6.0,
      timestamp: Date.now(),
    };

    setCurrentLocation(point);
    const res = engine.processLocation(point);
    setState(res.state);
    setCount(res.count);

    if (res.event === "STAY_AT_START") {
      addLog(
        `GPS jitter near Point A (${Math.round(
          res.distanceToStartMeters || 3
        )}m). Count stays ${res.count}/${target}. Duplicate count prevented.`
      );
    } else {
      addLog(`Reading processed: ${res.event}`);
    }
  }, [startPoint, target, addLog]);

  const simulateCompleteCycle = useCallback(() => {
    const engine = engineRef.current;
    if (engine.getState() === "idle") {
      addLog("Start session first before simulating a cycle.");
      return;
    }
    simulateDeparture();
    setTimeout(() => {
      simulateReturn();
    }, 150);
  }, [simulateDeparture, simulateReturn, addLog]);

  return {
    target,
    count,
    state,
    mode,
    startPoint,
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
    clearCompletedSummary: () => setCompletedSummary(null),
    updateSettings,
    selectTarget,
    setMode: handleToggleMode,
    startSession,
    startWithCountdown,
    cancelCountdown,
    pauseSession,
    resumeSession,
    endSession,
    simulateDeparture,
    simulateReturn,
    simulateStayAtStart,
    simulateCompleteCycle,
  };
}
