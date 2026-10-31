/**
 * Location Provider Abstraction.
 * Decouples the source of geographic coordinates (Browser Geolocation API vs Simulator)
 * from the Counting Engine and UI.
 */

import { LocationPoint } from "@/types/session";

export interface LocationError {
  code: "PERMISSION_DENIED" | "POSITION_UNAVAILABLE" | "TIMEOUT" | "NOT_SUPPORTED" | "UNKNOWN";
  message: string;
  userGuidance: string;
}

export interface LocationProvider {
  start(
    onLocation: (point: LocationPoint) => void,
    onError: (error: LocationError) => void
  ): void;
  stop(): void;
  getCurrentPosition(): Promise<LocationPoint>;
}

export class BrowserLocationProvider implements LocationProvider {
  private watchId: number | null = null;
  private isWatching = false;

  private formatError(err: GeolocationPositionError | { code?: number; message?: string }): LocationError {
    switch (err.code) {
      case 1: // PERMISSION_DENIED
        return {
          code: "PERMISSION_DENIED",
          message: "Location permission denied.",
          userGuidance: "Please enable location access in your browser settings so the counter can detect departure and return to Point A.",
        };
      case 2: // POSITION_UNAVAILABLE
        return {
          code: "POSITION_UNAVAILABLE",
          message: "Location unavailable.",
          userGuidance: "Unable to acquire a GPS fix. Please ensure device Location/GPS is turned on and you have a clear view of the sky.",
        };
      case 3: // TIMEOUT
        return {
          code: "TIMEOUT",
          message: "Location request timed out.",
          userGuidance: "GPS acquisition took too long. Retrying with high accuracy...",
        };
      default:
        return {
          code: "UNKNOWN",
          message: err.message || "An unknown location error occurred.",
          userGuidance: "Please check your device GPS settings.",
        };
    }
  }

  public async getCurrentPosition(): Promise<LocationPoint> {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      throw {
        code: "NOT_SUPPORTED",
        message: "Geolocation is not supported by this browser.",
        userGuidance: "Please open this app in Chrome, Safari, or a modern mobile browser.",
      } as LocationError;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp || Date.now(),
          });
        },
        (error) => {
          reject(this.formatError(error));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  }

  public start(
    onLocation: (point: LocationPoint) => void,
    onError: (error: LocationError) => void
  ): void {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      onError({
        code: "NOT_SUPPORTED",
        message: "Geolocation is not supported by this browser.",
        userGuidance: "Please open this app in Chrome, Safari, or a modern mobile browser.",
      });
      return;
    }

    if (this.isWatching) {
      this.stop();
    }

    this.isWatching = true;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        onLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp || Date.now(),
        });
      },
      (error) => {
        onError(this.formatError(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 3000, // Accept cached readings up to 3s old for smooth battery/GPS performance
      }
    );
  }

  public stop(): void {
    if (this.watchId !== null && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isWatching = false;
  }
}

