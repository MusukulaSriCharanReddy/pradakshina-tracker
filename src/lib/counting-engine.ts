/**
 * Standalone Pradakshina Counting Engine.
 *
 * Implements the non-negotiable core rule:
 * Start at Point A -> Leave Point A -> Return to Point A = Count +1.
 *
 * Completely decoupled from React, DOM, and browser Geolocation APIs.
 * Operates purely on LocationPoint data and configurable thresholds.
 */

import type { LocationPoint, TrackingState } from "../types/session.ts";
import { calculateHaversineDistanceMeters } from "./geo-utils.ts";

export interface CountingEngineConfig {
  /** Distance in meters from Point A required to consider the user departed (default: 20m) */
  departureRadiusMeters: number;
  /** Distance in meters from Point A required to consider the user returned (default: 8m) */
  returnRadiusMeters: number;
  /** Maximum acceptable GPS accuracy in meters. Readings with higher error are rejected (default: 20m) */
  maxAccuracyThresholdMeters: number;
  /** Maximum age of a GPS reading in milliseconds before it is considered stale (default: 30,000ms) */
  maxStaleReadingAgeMs: number;
}

export const DEFAULT_ENGINE_CONFIG: CountingEngineConfig = {
  departureRadiusMeters: 20,
  returnRadiusMeters: 8,
  maxAccuracyThresholdMeters: 20,
  maxStaleReadingAgeMs: 30000,
};

export type EngineEvent =
  | "STARTED"
  | "DEPARTURE_DETECTED"
  | "RETURN_DETECTED"
  | "TARGET_COMPLETED"
  | "STAY_AT_START"
  | "READING_REJECTED_ACCURACY"
  | "READING_REJECTED_STALE"
  | "READING_IGNORED_PAUSED"
  | "READING_IGNORED_COMPLETED"
  | "READING_IGNORED_IDLE";

export interface ProcessLocationResult {
  state: TrackingState;
  count: number;
  event: EngineEvent;
  isAccepted: boolean;
  distanceToStartMeters?: number;
  rejectionReason?: string;
}

export class PradakshinaCountingEngine {
  private config: CountingEngineConfig;
  private state: TrackingState = "idle";
  private previousState: TrackingState = "waiting-for-departure";
  private startPoint: LocationPoint | null = null;
  private count: number = 0;
  private target: number = 108;

  constructor(config: Partial<CountingEngineConfig> = {}) {
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
  }

  public getConfig(): CountingEngineConfig {
    return { ...this.config };
  }

  public setConfig(config: Partial<CountingEngineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public getState(): TrackingState {
    return this.state;
  }

  public getCount(): number {
    return this.count;
  }

  public getTarget(): number {
    return this.target;
  }

  public getStartPoint(): LocationPoint | null {
    return this.startPoint ? { ...this.startPoint } : null;
  }

  /**
   * Initializes and starts a new session with Point A registered at the provided start point.
   */
  public start(startPoint: LocationPoint, target: number): ProcessLocationResult {
    if (target <= 0) {
      throw new Error("Target rounds must be a positive integer.");
    }
    this.startPoint = { ...startPoint };
    this.target = target;
    this.count = 0;
    this.state = "waiting-for-departure";
    this.previousState = "waiting-for-departure";

    return {
      state: this.state,
      count: this.count,
      event: "STARTED",
      isAccepted: true,
      distanceToStartMeters: 0,
    };
  }

  /**
   * Temporarily pauses tracking. Readings fed during pause are ignored for round counting.
   */
  public pause(): void {
    if (this.state === "waiting-for-departure" || this.state === "waiting-for-return") {
      this.previousState = this.state;
      this.state = "paused";
    }
  }

  /**
   * Resumes tracking from the previous active state.
   */
  public resume(): void {
    if (this.state === "paused") {
      this.state = this.previousState;
    }
  }

  /**
   * Ends the session and resets the engine state.
   */
  public end(): void {
    this.state = "idle";
    this.count = 0;
    this.startPoint = null;
  }

  /**
   * Evaluates an incoming location sample against the state machine and thresholds.
   *
   * Invariant:
   * 1. Start at A (count = 0)
   * 2. Move outside departure radius (state -> waiting-for-return)
   * 3. Move inside return radius (state -> waiting-for-departure, count += 1)
   * 4. Must leave Point A again before the next count.
   */
  public processLocation(point: LocationPoint, now: number = Date.now()): ProcessLocationResult {
    if (this.state === "idle") {
      return {
        state: this.state,
        count: this.count,
        event: "READING_IGNORED_IDLE",
        isAccepted: false,
        rejectionReason: "Session has not been started.",
      };
    }

    if (this.state === "completed") {
      return {
        state: this.state,
        count: this.count,
        event: "READING_IGNORED_COMPLETED",
        isAccepted: false,
        rejectionReason: "Target already reached.",
      };
    }

    if (this.state === "paused") {
      return {
        state: this.state,
        count: this.count,
        event: "READING_IGNORED_PAUSED",
        isAccepted: false,
        rejectionReason: "Tracking is currently paused.",
      };
    }

    // Accuracy Filter
    if (point.accuracy > this.config.maxAccuracyThresholdMeters) {
      return {
        state: this.state,
        count: this.count,
        event: "READING_REJECTED_ACCURACY",
        isAccepted: false,
        rejectionReason: `Accuracy ${point.accuracy}m is worse than limit ${this.config.maxAccuracyThresholdMeters}m.`,
      };
    }

    // Stale Reading Filter
    const ageMs = now - point.timestamp;
    if (ageMs > this.config.maxStaleReadingAgeMs) {
      return {
        state: this.state,
        count: this.count,
        event: "READING_REJECTED_STALE",
        isAccepted: false,
        rejectionReason: `Reading timestamp is ${Math.round(ageMs / 1000)}s old (max allowed: ${Math.round(
          this.config.maxStaleReadingAgeMs / 1000
        )}s).`,
      };
    }

    if (!this.startPoint) {
      return {
        state: this.state,
        count: this.count,
        event: "READING_IGNORED_IDLE",
        isAccepted: false,
        rejectionReason: "No starting point registered.",
      };
    }

    const distance = calculateHaversineDistanceMeters(this.startPoint, point);

    // State 1: WAITING_FOR_DEPARTURE
    if (this.state === "waiting-for-departure") {
      if (distance >= this.config.departureRadiusMeters) {
        this.state = "waiting-for-return";
        return {
          state: this.state,
          count: this.count,
          event: "DEPARTURE_DETECTED",
          isAccepted: true,
          distanceToStartMeters: distance,
        };
      }

      // Still at or near Point A (Duplicate Prevention)
      return {
        state: this.state,
        count: this.count,
        event: "STAY_AT_START",
        isAccepted: true,
        distanceToStartMeters: distance,
      };
    }

    // State 2: WAITING_FOR_RETURN
    if (this.state === "waiting-for-return") {
      if (distance <= this.config.returnRadiusMeters) {
        this.count += 1;

        if (this.count >= this.target) {
          this.state = "completed";
          return {
            state: this.state,
            count: this.count,
            event: "TARGET_COMPLETED",
            isAccepted: true,
            distanceToStartMeters: distance,
          };
        }

        // Valid return counted! Immediately require a new departure.
        this.state = "waiting-for-departure";
        return {
          state: this.state,
          count: this.count,
          event: "RETURN_DETECTED",
          isAccepted: true,
          distanceToStartMeters: distance,
        };
      }

      // Still away from Point A; continuing the walk
      return {
        state: this.state,
        count: this.count,
        event: "DEPARTURE_DETECTED",
        isAccepted: true,
        distanceToStartMeters: distance,
      };
    }

    return {
      state: this.state,
      count: this.count,
      event: "READING_IGNORED_IDLE",
      isAccepted: false,
    };
  }
}
