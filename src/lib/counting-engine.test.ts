import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PradakshinaCountingEngine } from "./counting-engine.ts";
import { calculateHaversineDistanceMeters, calculateDestinationPoint } from "./geo-utils.ts";
import type { LocationPoint } from "../types/session.ts";

const START_POINT: LocationPoint = {
  latitude: 12.9716,
  longitude: 77.5946,
  accuracy: 4.0,
  timestamp: Date.now(),
};

describe("Geospatial Utilities (geo-utils)", () => {
  it("calculates 0 distance between identical coordinates", () => {
    const dist = calculateHaversineDistanceMeters(START_POINT, START_POINT);
    assert.strictEqual(Math.round(dist), 0);
  });

  it("calculates accurate distances using calculateDestinationPoint", () => {
    // Generate a point exactly 25 meters North (0 degrees)
    const p25m = calculateDestinationPoint(START_POINT, 25, 0);
    const dist = calculateHaversineDistanceMeters(START_POINT, p25m);
    assert.ok(Math.abs(dist - 25) < 0.2, `Expected ~25m, got ${dist}`);
  });

  it("calculates accurate distances in all cardinal directions", () => {
    for (const bearing of [0, 90, 180, 270]) {
      const dest = calculateDestinationPoint(START_POINT, 50, bearing);
      const dist = calculateHaversineDistanceMeters(START_POINT, dest);
      assert.ok(Math.abs(dist - 50) < 0.2, `Failed for bearing ${bearing}: got ${dist}`);
    }
  });
});

describe("Counting Engine (TEST_PLAN.md Specification Matrix)", () => {
  it("Test 1: Start only — Register Point A with no movement", () => {
    const engine = new PradakshinaCountingEngine();
    const res = engine.start(START_POINT, 11);

    assert.strictEqual(res.state, "waiting-for-departure");
    assert.strictEqual(res.count, 0);
    assert.strictEqual(engine.getState(), "waiting-for-departure");
    assert.strictEqual(engine.getCount(), 0);
  });

  it("Test 2: Departure only — Move outside departure radius (>20m)", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);

    // Point 25m East (outside 20m threshold)
    const departedPoint: LocationPoint = {
      ...calculateDestinationPoint(START_POINT, 25, 90),
      accuracy: 5.0,
      timestamp: Date.now(),
    };

    const res = engine.processLocation(departedPoint);
    assert.strictEqual(res.state, "waiting-for-return");
    assert.strictEqual(res.count, 0);
    assert.strictEqual(res.event, "DEPARTURE_DETECTED");
  });

  it("Test 3: One return — Depart then return inside return radius (<8m)", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);

    // 1. Depart
    const departedPoint: LocationPoint = {
      ...calculateDestinationPoint(START_POINT, 30, 90),
      accuracy: 4.0,
      timestamp: Date.now(),
    };
    engine.processLocation(departedPoint);

    // 2. Return within 4m of Point A
    const returnedPoint: LocationPoint = {
      ...calculateDestinationPoint(START_POINT, 4, 0),
      accuracy: 4.0,
      timestamp: Date.now(),
    };
    const res = engine.processLocation(returnedPoint);

    assert.strictEqual(res.state, "waiting-for-departure");
    assert.strictEqual(res.count, 1);
    assert.strictEqual(res.event, "RETURN_DETECTED");
  });

  it("Test 4: Stay at start — Sending repeated readings near Point A does NOT increment count", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);

    // Depart and return once (count becomes 1)
    const pFar = { ...calculateDestinationPoint(START_POINT, 25, 45), accuracy: 4, timestamp: Date.now() };
    const pNear = { ...calculateDestinationPoint(START_POINT, 3, 45), accuracy: 4, timestamp: Date.now() };
    engine.processLocation(pFar);
    engine.processLocation(pNear);
    assert.strictEqual(engine.getCount(), 1);

    // Now send 10 readings near Point A (simulating standing in darshan or praying)
    for (let i = 0; i < 10; i++) {
      const pStay = {
        ...calculateDestinationPoint(START_POINT, 2 + (i % 3), (i * 30) % 360),
        accuracy: 5.0,
        timestamp: Date.now(),
      };
      const stayRes = engine.processLocation(pStay);
      assert.strictEqual(stayRes.event, "STAY_AT_START");
      assert.strictEqual(stayRes.count, 1, "Count must remain 1 while near Point A");
    }
  });

  it("Test 5: Second round — Require departure before counting a second return", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);

    // Round 1
    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 25, 0), accuracy: 4, timestamp: Date.now() });
    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 3, 0), accuracy: 4, timestamp: Date.now() });
    assert.strictEqual(engine.getCount(), 1);

    // Round 2
    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 28, 180), accuracy: 4, timestamp: Date.now() });
    const res = engine.processLocation({ ...calculateDestinationPoint(START_POINT, 4, 180), accuracy: 4, timestamp: Date.now() });
    assert.strictEqual(res.count, 2);
    assert.strictEqual(res.state, "waiting-for-departure");
  });

  it("Test 6: Arbitrary route — Any path away from A and back increments exactly once", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 21);

    // Simulate winding path: A -> 10m -> 22m -> 35m -> 20m -> 5m (A)
    const distances = [10, 22, 35, 20, 5];
    for (const d of distances) {
      engine.processLocation({
        ...calculateDestinationPoint(START_POINT, d, Math.random() * 360),
        accuracy: 4.0,
        timestamp: Date.now(),
      });
    }

    assert.strictEqual(engine.getCount(), 1);
  });

  it("Test 7: Reverse direction — Walking opposite direction increments correctly", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);

    // Depart West (270 deg) instead of East (90 deg)
    engine.processLocation({
      ...calculateDestinationPoint(START_POINT, 30, 270),
      accuracy: 3.5,
      timestamp: Date.now(),
    });
    // Return from South
    engine.processLocation({
      ...calculateDestinationPoint(START_POINT, 4, 180),
      accuracy: 3.5,
      timestamp: Date.now(),
    });

    assert.strictEqual(engine.getCount(), 1);
  });

  it("Test 8: Short route — Small loop outside 20m and back increments once", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);

    // Just crosses 20m (21m) and immediately returns to 6m
    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 21, 45), accuracy: 4, timestamp: Date.now() });
    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 6, 45), accuracy: 4, timestamp: Date.now() });

    assert.strictEqual(engine.getCount(), 1);
  });

  it("Test 9: GPS jitter & Hysteresis — Boundary fluctuations (12m..16m) do not cause false counts", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);

    // User is in buffer zone (between return threshold 8m and departure threshold 20m)
    const jitterDistances = [9, 14, 11, 16, 12, 18, 10];
    for (const d of jitterDistances) {
      const res = engine.processLocation({
        ...calculateDestinationPoint(START_POINT, d, 90),
        accuracy: 5.0,
        timestamp: Date.now(),
      });
      assert.strictEqual(res.count, 0);
      assert.strictEqual(res.state, "waiting-for-departure");
    }
  });

  it("Test 10: Poor accuracy — Readings worse than max threshold are rejected", () => {
    const engine = new PradakshinaCountingEngine({ maxAccuracyThresholdMeters: 20 });
    engine.start(START_POINT, 11);

    // Poor accuracy reading (accuracy = 35m)
    const poorReading: LocationPoint = {
      ...calculateDestinationPoint(START_POINT, 50, 0),
      accuracy: 35.0,
      timestamp: Date.now(),
    };

    const res = engine.processLocation(poorReading);
    assert.strictEqual(res.isAccepted, false);
    assert.strictEqual(res.event, "READING_REJECTED_ACCURACY");
    assert.strictEqual(engine.getState(), "waiting-for-departure", "Engine state must not change on rejected reading");
  });

  it("Test 11: Stale reading — Readings older than timeout are rejected", () => {
    const engine = new PradakshinaCountingEngine({ maxStaleReadingAgeMs: 30000 });
    engine.start(START_POINT, 11);

    const now = Date.now();
    const staleReading: LocationPoint = {
      ...calculateDestinationPoint(START_POINT, 40, 0),
      accuracy: 4.0,
      timestamp: now - 45000, // 45 seconds old
    };

    const res = engine.processLocation(staleReading, now);
    assert.strictEqual(res.isAccepted, false);
    assert.strictEqual(res.event, "READING_REJECTED_STALE");
    assert.strictEqual(engine.getState(), "waiting-for-departure");
  });

  it("Test 12: Pause — Points fed while paused are ignored for round counting", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);
    engine.pause();

    assert.strictEqual(engine.getState(), "paused");

    // Feed points that would normally trigger departure and return
    const res1 = engine.processLocation({ ...calculateDestinationPoint(START_POINT, 30, 0), accuracy: 4, timestamp: Date.now() });
    const res2 = engine.processLocation({ ...calculateDestinationPoint(START_POINT, 2, 0), accuracy: 4, timestamp: Date.now() });

    assert.strictEqual(res1.event, "READING_IGNORED_PAUSED");
    assert.strictEqual(res2.event, "READING_IGNORED_PAUSED");
    assert.strictEqual(engine.getCount(), 0);
  });

  it("Test 13: Resume — Resumed session can depart and return to count", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 11);
    engine.pause();
    engine.resume();

    assert.strictEqual(engine.getState(), "waiting-for-departure");

    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 25, 0), accuracy: 4, timestamp: Date.now() });
    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 3, 0), accuracy: 4, timestamp: Date.now() });

    assert.strictEqual(engine.getCount(), 1);
  });

  it("Test 14: Target reached — State changes to completed upon final return", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 3); // Target = 3 rounds

    for (let round = 1; round <= 3; round++) {
      engine.processLocation({ ...calculateDestinationPoint(START_POINT, 25, round * 30), accuracy: 4, timestamp: Date.now() });
      const res = engine.processLocation({ ...calculateDestinationPoint(START_POINT, 4, round * 30), accuracy: 4, timestamp: Date.now() });

      if (round < 3) {
        assert.strictEqual(res.state, "waiting-for-departure");
        assert.strictEqual(res.count, round);
      } else {
        assert.strictEqual(res.state, "completed");
        assert.strictEqual(res.count, 3);
        assert.strictEqual(res.event, "TARGET_COMPLETED");
      }
    }
  });

  it("Test 15: Post-completion immunity — Readings after completion do not exceed target", () => {
    const engine = new PradakshinaCountingEngine();
    engine.start(START_POINT, 1);

    // Complete target
    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 25, 0), accuracy: 4, timestamp: Date.now() });
    engine.processLocation({ ...calculateDestinationPoint(START_POINT, 4, 0), accuracy: 4, timestamp: Date.now() });
    assert.strictEqual(engine.getState(), "completed");
    assert.strictEqual(engine.getCount(), 1);

    // Try to feed more movements
    const extraRes = engine.processLocation({ ...calculateDestinationPoint(START_POINT, 30, 0), accuracy: 4, timestamp: Date.now() });
    assert.strictEqual(extraRes.event, "READING_IGNORED_COMPLETED");
    assert.strictEqual(engine.getCount(), 1);
  });
});
