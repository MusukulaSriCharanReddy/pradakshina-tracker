# Agent Instructions — Pradakshina Tracker

You are the engineering agent working in this repository.

## Product rule — do not change

**Start at Point A → Leave Point A → Return to Point A = Count +1.**

The user may walk any route and in any direction. Count a return after a detected departure. Do not require route validation, route calibration, path-shape recognition, direction checks, or minimum route geometry.

Do not reinterpret this rule or add stricter religious or route criteria.

## Working style
- Inspect the existing workspace before changing files.
- Preserve existing work. Do not delete or overwrite files without explaining why and obtaining approval.
- Work in small, verifiable milestones.
- Explain important decisions in beginner-friendly language.
- Keep the counting engine independent from UI and GPS APIs.
- Test the engine with simulated locations before connecting GPS.
- Add automated tests for counting behavior.
- Run lint, type checks, and tests when available.
- Report changed files and actual test results. Never claim tests passed unless run.

## Technical guardrails
- Use TypeScript.
- Keep GPS thresholds configurable.
- Filter poor-accuracy and stale readings.
- Use separate departure and return thresholds.
- Require a new departure after every counted return.
- Do not count while paused or after target completion.
- Request location permission only when tracking starts.
- Do not send location data to a backend in the MVP.
- Do not promise reliable browser background tracking.

## Scope guardrails
Do not add social feeds, leaderboards, followers, route recording/validation, temple directories, cloud accounts, or unrelated fitness features to the MVP.

## Before each milestone
1. State the goal.
2. List expected files to change.
3. Implement the smallest useful change.
4. Run relevant checks.
5. Summarize results and limitations.
