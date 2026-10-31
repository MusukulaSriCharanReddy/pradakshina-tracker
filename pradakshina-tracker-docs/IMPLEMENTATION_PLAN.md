# Implementation Plan

Work in small milestones. Do not generate the whole app in one pass.

## Milestone 0 — Inspect workspace
- Read the existing project brief and files.
- Check Node.js/npm versions and existing project setup.
- Inspect dependencies and scripts.
- Preserve existing work.
- Report what exists and what is missing.

**Deliverable:** workspace inspection report.

## Milestone 1 — Foundation
- Verify or set up Next.js, React, TypeScript, Tailwind.
- Confirm the app runs locally.
- Create a responsive app shell and run instructions.

**Acceptance:** app opens locally without errors.

## Milestone 2 — UI + simulation
- Target selection.
- Tracking dashboard.
- Count, target, remaining, progress, and status.
- Pause, resume, end controls.
- Simulated location controls.

**Acceptance:** UI works with simulated events.

## Milestone 3 — Counting engine
- Standalone state machine.
- Distance helper.
- Accuracy and stale-reading filters.
- Configurable departure/return thresholds.
- Duplicate prevention.
- Automated tests.

**Acceptance:** core tests pass without real GPS.

## Milestone 4 — Real GPS
- Browser Geolocation provider.
- Request permission on Start.
- Handle denied, timeout, unavailable, stale, and poor-accuracy readings.
- Keep simulation available.

**Acceptance:** foreground tracking tested on a real Android device.

## Milestone 5 — Persistence and polish
- Local session persistence.
- Safe session restoration after refresh.
- Completion summary.
- Accessibility and error-state improvements.

**Acceptance:** user can complete a target session and view a summary.

## Milestone 6 — PWA and field testing
- Add installability after core logic is stable.
- Test outdoors, near buildings, and under covered areas where safe.
- Record false positives and missed returns.
- Decide whether native mobile is needed.

**Acceptance:** documented real-device results and known limitations.

## Development rule
For each milestone: explain goal, list files to change, implement smallest useful change, run tests/checks, report changed files and results, then seek approval before a major next milestone.
