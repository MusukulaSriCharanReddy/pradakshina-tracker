export type TrackingState =
  | "idle"
  | "waiting-for-departure"
  | "waiting-for-return"
  | "paused"
  | "completed";

export type TrackingMode = "gps" | "simulated";

export type GpsAccuracyQuality = "good" | "fair" | "poor" | "unusable" | "none";

export type LocationPoint = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

export type TargetPreset = 3 | 9 | 11 | 21 | 51 | 108;

export interface PradakshinaSession {
  id: string;
  target: number;
  count: number;
  startPoint: LocationPoint | null;
  state: TrackingState;
  previousState?: TrackingState; // Used to resume after pause
  startedAt: number;
  updatedAt: number;
  mode: TrackingMode;
}
