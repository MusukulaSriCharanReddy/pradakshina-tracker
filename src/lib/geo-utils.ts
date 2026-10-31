/**
 * Pure geospatial utility functions for distance and coordinate calculation.
 * Independent of DOM, browser APIs, or UI frameworks.
 */

export interface LatLon {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 * @returns Distance in meters.
 */
export function calculateHaversineDistanceMeters(p1: LatLon, p2: LatLon): number {
  const phi1 = toRadians(p1.latitude);
  const phi2 = toRadians(p2.latitude);
  const deltaPhi = toRadians(p2.latitude - p1.latitude);
  const deltaLambda = toRadians(p2.longitude - p1.longitude);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Calculates a new destination coordinate given a start point, distance in meters, and bearing in degrees.
 * Useful for simulated routes, arbitrary paths, and test data generation.
 * @param start Starting latitude and longitude
 * @param distanceMeters Distance to move in meters
 * @param bearingDegrees Bearing direction (0 = North, 90 = East, 180 = South, 270 = West)
 */
export function calculateDestinationPoint(
  start: LatLon,
  distanceMeters: number,
  bearingDegrees: number
): LatLon {
  const delta = distanceMeters / EARTH_RADIUS_METERS;
  const theta = toRadians(bearingDegrees);
  const phi1 = toRadians(start.latitude);
  const lambda1 = toRadians(start.longitude);

  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const sinDelta = Math.sin(delta);
  const cosDelta = Math.cos(delta);

  const sinPhi2 = sinPhi1 * cosDelta + cosPhi1 * sinDelta * Math.cos(theta);
  const phi2 = Math.asin(sinPhi2);

  const y = Math.sin(theta) * sinDelta * cosPhi1;
  const x = cosDelta - sinPhi1 * sinPhi2;
  const lambda2 = lambda1 + Math.atan2(y, x);

  return {
    latitude: toDegrees(phi2),
    longitude: ((toDegrees(lambda2) + 540) % 360) - 180, // Normalize to -180..+180
  };
}

