# Feature List

## P0 — MVP must-haves

| Feature | Description | Acceptance condition |
|---|---|---|
| Target selection | 11, 21, 51, 108, custom | Valid positive target can be selected |
| Start session | Register current location as Point A | Starts only with a usable location fix |
| Departure detection | Detect leaving starting area | State changes to waiting for return |
| Return detection | Detect re-entry after departure | Count increments exactly once |
| Duplicate prevention | Require a new departure before next count | Staying at Point A cannot add counts |
| Live counter | Completed / target | Updates after valid return |
| Progress | Remaining count and progress | Values match count and target |
| Pause/resume | Temporarily stop and continue | No count while paused |
| End session | Finish and show summary | Location updates stop |
| Simulated mode | Feed test locations | Logic can be tested without walking |
| Error states | Permission/GPS/accuracy errors | Clear message and next action |

## P1 — After core logic works
- Session summary: date, duration, target, completed count.
- Local session history.
- Installable PWA.
- Optional subtle haptic feedback.
- Configurable thresholds in a development/settings view.

## P2 — Later evaluation
- Native Android background tracking.
- Cloud backup and account sync.
- Additional languages.
- Optional debugging map.
- Accessibility refinements.

## Explicitly excluded
Route validation, direction enforcement, route calibration, step/distance-only counting, social feeds, followers, and leaderboards.
