# Test Plan

## Counting engine tests

| Test | Input | Expected result |
|---|---|---|
| Start only | Register Point A; no movement | Count 0 |
| Departure only | Move outside departure radius | Waiting for return; count 0 |
| One return | Depart, then return | Count 1 |
| Stay at start | Continue sending readings near A | Count remains 1 |
| Second round | Depart and return again | Count 2 |
| Arbitrary route | Any simulated path away from A and back | Count increments once |
| Reverse direction | Reverse simulated path | Count increments once |
| Short route | Return to A after any path, including a short path | Count increments once |
| GPS jitter | Unstable boundary readings | No false count |
| Poor accuracy | Accuracy worse than configured limit | Reading ignored |
| Stale reading | Old timestamp | Reading ignored |
| Pause | Feed points while paused | Count unchanged |
| Resume | Resume, depart, return | Count increments once |
| Target reached | Count reaches target | State completed |

## UI tests
- Preset/custom target selection works.
- Custom target must be a positive valid number.
- Count does not exceed target.
- Remaining count is never negative.
- Progress matches count and target.
- Pause/resume state is clear.
- End stops location updates.
- Permission-denied and GPS-unavailable messages are understandable.
- Simulated mode is clearly labelled.

## Real-device tests
Use an Android phone in open outdoor areas, near buildings, and under covered walkways where safe. Record device/browser, thresholds, reported accuracy, false positives, missed returns, and screen-lock behavior.

Do not claim indoor reliability based only on outdoor tests.

## MVP definition of done
- Simulated departure-return tests pass.
- Each valid cycle increments exactly once.
- Staying at Point A does not repeatedly increment.
- Poor/stale readings do not trigger a count.
- UI communicates tracking status and limitations.
- Foreground GPS has been tried on a real Android device.
