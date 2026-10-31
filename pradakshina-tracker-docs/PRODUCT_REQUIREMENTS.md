# Product Requirements

## Problem
During repeated Pradakshina, people may lose track of their count, especially when aiming for a larger target such as 108. Manual counting or paper checklists can interrupt the experience.

## Goal
Provide a simple, respectful tool that keeps count automatically.

## Non-negotiable counting rule
**Start at Point A → Leave Point A → Return to Point A = Count +1.**

- Point A is registered when the user starts a session.
- The user can walk any route and in any direction.
- Once departed, a subsequent return to the starting area increments the count once.
- Remaining near Point A must not repeatedly increment the count.
- After a count, the app waits for another departure before counting another return.

The app counts location events. It does not judge religious or spiritual validity.

## User journey
1. Open app and choose target: 11, 21, 51, 108, or custom.
2. Stand at the desired starting location and tap Start.
3. Grant location permission; app saves Point A.
4. Walk freely.
5. App detects departure, then return.
6. Count increments once.
7. Repeat until target, or pause/end session.

## Functional requirements
- Preset and custom target selection.
- Register current location as Point A.
- Departure and return detection.
- Exactly one increment per departure-return cycle.
- Count, target, remaining count, progress, and tracking status.
- Pause, resume, and end session.
- Simulated-location mode for development.
- Handle permission denial, unavailable location, poor accuracy, and stale readings.
- Persist session locally where practical.

## Non-functional requirements
- Mobile-first, responsive, calm interface.
- Large, glanceable count.
- Minimal interaction while walking.
- No social competition or leaderboards in MVP.
- No misleading claims about browser background tracking.

## Out of scope
Route recording/validation, direction detection, shape recognition, step-based round counting, social features, user accounts/cloud sync, temple directory, and spiritual scoring.
