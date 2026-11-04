/**
 * LocalStorage persistence layer for Pradakshina sessions, history, and settings.
 * Safe for SSR (guards against window being undefined).
 */

import { LocationPoint, TrackingState, TrackingMode } from "@/types/session";

const STORAGE_KEY_ACTIVE = "pradakshina_active_session_v1";
const STORAGE_KEY_HISTORY = "pradakshina_session_history_v1";
const STORAGE_KEY_SETTINGS = "pradakshina_user_settings_v1";

export interface ActiveSessionData {
  id: string;
  target: number;
  count: number;
  startPoint: LocationPoint | null;
  state: TrackingState;
  mode: TrackingMode;
  startedAt: number;
  updatedAt: number;
  totalDistanceMeters: number;
}

export interface CompletedSessionRecord {
  id: string;
  date: string;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  targetRounds: number;
  completedRounds: number;
  approximateDistanceMeters: number;
  mode: TrackingMode;
}

export interface UserSettings {
  departureRadiusMeters: number;
  returnRadiusMeters: number;
  maxAccuracyThresholdMeters: number;
  hapticFeedback: boolean;
  soundChime: boolean;
  voiceAnnouncement: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  departureRadiusMeters: 20,
  returnRadiusMeters: 8,
  maxAccuracyThresholdMeters: 20,
  hapticFeedback: true,
  soundChime: true,
  voiceAnnouncement: false,
};

export function saveActiveSession(session: ActiveSessionData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(session));
  } catch (err) {
    console.error("Failed to save active session to localStorage", err);
  }
}

export function loadActiveSession(): ActiveSessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveSessionData;
  } catch (err) {
    console.error("Failed to parse active session from localStorage", err);
    return null;
  }
}

export function clearActiveSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_ACTIVE);
  } catch (err) {
    console.error("Failed to clear active session from localStorage", err);
  }
}

export function saveCompletedSession(record: CompletedSessionRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCompletedSessions();
    const updated = [record, ...existing.slice(0, 99)]; // Keep latest 100 sessions
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save completed session to history", err);
  }
}

export function getCompletedSessions(): CompletedSessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw) as CompletedSessionRecord[];
  } catch (err) {
    console.error("Failed to load session history", err);
    return [];
  }
}

export function clearCompletedHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (err) {
    console.error("Failed to clear session history", err);
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error("Failed to save settings to localStorage", err);
  }
}

export function loadUserSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_USER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_USER_SETTINGS;
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error("Failed to parse user settings", err);
    return DEFAULT_USER_SETTINGS;
  }
}

