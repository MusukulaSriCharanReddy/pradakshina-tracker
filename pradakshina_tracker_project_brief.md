# Pradakshina Tracker — Project Brief & Prototype Handoff

## 1. Project idea

Build a simple, Strava-inspired mobile-friendly tracker for counting Pradakshinas (circumambulations) at Hindu temples.

During Pradakshina, a person may walk around a deity or temple multiple times. When aiming for a larger count such as 108, it is easy to lose track. People may otherwise count manually, write numbers on paper, or cross them off one by one.

The app should reduce this counting burden by automatically increasing the count whenever the user returns to the starting point after leaving it.

**The product is a devotional round counter, not a general fitness or social-fitness app.**

## 2. The core rule — keep this simple

The central counting rule is:

> **Start at Point A → leave Point A → return to Point A = count +1.**

The app does **not** need to check whether the person followed a particular route, walked in a particular direction, or traced a square, rectangle, or circle.

The person may take whatever path they choose. The only intended condition for a count is that they have moved away from the registered starting area and subsequently returned to it.

### Explicitly do NOT add these requirements

- Do not require the user to complete a predefined GPS route.
- Do not require route calibration or route recording.
- Do not check whether the path is square, rectangular, circular, or geometrically complete.
- Do not enforce a walking direction.
- Do not use step count or distance alone as the round count.
- Do not add complicated route validation or spiritual-validity judgments.

Keep the prototype focused on the simple start-point return rule.

## 3. Expected user experience

1. User opens the app.
2. User chooses a target, for example 11, 21, 51, 108, or a custom number.
3. User stands at the place where they want to begin and taps **Start**.
4. The app registers the current location as **Point A**.
5. User walks away and continues their Pradakshina.
6. When the app detects that the user has returned to the starting area, it increments the count by one.
7. The app then waits for the user to leave Point A again before it can count another return.
8. The process repeats until the target is reached.

Example:
- Start at A: count = 0.
- Walk away from A.
- Return to A: count = 1.
- Leave A again.
- Return to A: count = 2.
- Continue until 108, or the selected target.

## 4. Counting state machine

Implement the core logic as a small state machine:

- `NOT_STARTED`: No session is active.
- `WAITING_FOR_DEPARTURE`: Starting point has been saved; wait until the user moves outside the departure radius.
- `WAITING_FOR_RETURN`: User has departed; wait until they re-enter the return radius.
- On a valid return: increment the count exactly once, then transition back to `WAITING_FOR_DEPARTURE`.
- `PAUSED`: Tracking is paused; do not count.
- `COMPLETED`: Target reached; show completion state.

Pseudo-logic:

```text
when user presses Start:
    save current location as Point A
    count = 0
    state = WAITING_FOR_DEPARTURE

while session is active:
    read location

    if state == WAITING_FOR_DEPARTURE:
        if user is reliably outside departure radius:
            state = WAITING_FOR_RETURN

    else if state == WAITING_FOR_RETURN:
        if user is reliably inside return radius:
            count = count + 1
            state = WAITING_FOR_DEPARTURE

    if count >= target:
        state = COMPLETED
```

Use separate configurable departure and return thresholds if helpful. For example, start experimentation with a departure radius around 15–20 metres and a return radius around 5–8 metres. These are only initial test values, not guaranteed GPS accuracy. Make them configurable during development.

### Important anti-duplicate safeguards

- Require multiple stable location readings before treating a user as having departed or returned.
- Do not count repeatedly while the user remains near Point A.
- After a count, require a new departure before another count can occur.
- Ignore poor-accuracy or stale GPS readings.
- Show GPS accuracy/status in a simple debug area during prototype testing.
- Provide pause, resume, and end-session controls.
- Do not silently fabricate a count when location permission is unavailable.

## 5. MVP screens

Keep the first version small and usable.

### A. Home / setup
- App name: Pradakshina Tracker (working title).
- Target selector: 11, 21, 51, 108, and Custom.
- Start button.
- Short explanation that the app counts a return to the registered starting location after departure.

### B. Active tracking
- Large completed-round count, e.g. `37 / 108`.
- Progress indicator.
- Remaining rounds.
- Tracking status: Waiting to leave starting point / Away from starting point / Return detected.
- GPS accuracy indicator for testing.
- Pause and End buttons.
- Avoid requiring the user to interact with the phone while walking.

### C. Completion
- Clear target-completed message.
- Final count.
- Option to start a new session.

### D. Optional session summary
- Date and duration.
- Target and completed count.
- Approximate distance can be shown as secondary information, but must never determine the round count.

## 6. Technical approach

The first prototype can use location-based detection.

Possible web prototype stack:
- Next.js + React
- Tailwind CSS
- Browser Geolocation API
- LocalStorage for basic session persistence
- Leaflet + OpenStreetMap only if a map is useful for debugging

Important platform limitation:
- A browser prototype is useful for demonstrating the interface and basic foreground location logic.
- Reliable background tracking, screen-off behavior, and sensor access may require a native Android app or a suitable cross-platform mobile implementation later.
- Mobile browsers may suspend location updates when the screen is locked or the app is backgrounded. Do not claim reliable background tracking until tested on real devices.

GPS can drift, especially near buildings and covered temple pathways. The prototype should be honest about this limitation. Test outdoors first, then investigate sensor assistance or other approaches if needed. Do not over-engineer the first version.

## 7. Design principles

- Calm, respectful, uncluttered interface.
- Large count that can be checked at a glance.
- Minimal phone interaction during the devotional activity.
- No loud, disruptive notifications by default.
- No social competition or leaderboards in the MVP.
- Do not present the app as judging whether a person's religious practice is spiritually valid. It only tracks physical location events according to the user's chosen starting point.

## 8. What success looks like for the first prototype

A successful first demo should prove this one behavior:

1. Register a starting point.
2. Detect that the user has moved away from it.
3. Detect that the user has returned.
4. Increment the count once.
5. Refuse to increment again until the user leaves and returns again.

Test cases:
- Start and remain at Point A → count stays at 0.
- Leave Point A and return → count becomes 1.
- Remain near Point A after return → count stays at 1.
- Leave and return again → count becomes 2.
- GPS reading is inaccurate or stale → do not count based on that reading.
- Pause the session → no counts are added while paused.

## 9. Immediate build direction

Build a polished but small mobile-first prototype. Start with the location state machine and a simulated-location/debug mode so the counting behavior can be tested without physically walking every time. Then connect real device geolocation and test on an Android phone.

Do not expand the scope before the core counting behavior works.

---

# Prompt to continue in Gemini / Antigravity

Copy the prompt below into Gemini:

```text
I want you to act as my product engineer and help me build a working prototype in Google Antigravity.

Read the attached Markdown project brief carefully. It describes a small mobile-first app called Pradakshina Tracker.

The most important product requirement is:

START AT POINT A → LEAVE POINT A → RETURN TO POINT A = COUNT +1.

The user can walk by any route and in any direction. Do not require a predefined route, route calibration, geometric circuit detection, or direction validation. Do not overcomplicate this. The app only needs to detect departure from the registered starting area and a subsequent return to that area. It must count only once per departure-and-return cycle.

First, inspect the project brief and propose a concise implementation plan and architecture. Then build the prototype in small, testable steps.

Requirements:
1. Create a clean, respectful, mobile-first UI.
2. Let the user choose a target (11, 21, 51, 108, or custom).
3. Register the user's current location as Point A when they press Start.
4. Implement the counting state machine: waiting for departure → waiting for return → increment once → wait for the next departure.
5. Use GPS accuracy checks, stable readings, and separate departure/return thresholds to reduce false counts and duplicate counts. Keep thresholds configurable.
6. Include pause, resume, and end-session controls.
7. Show the current count, target, remaining rounds, progress, and tracking status.
8. Add a simulated-location/debug mode so we can test departure and return behavior without physically walking.
9. Handle location permission denial, unavailable location, poor accuracy, stale readings, and browser limitations gracefully.
10. Use LocalStorage for basic persistence if appropriate.
11. Do not claim background tracking works reliably in a browser. Explain what would be needed for a later native Android version.
12. Keep the first version focused. Do not add social feeds, leaderboards, complex maps, route recording, or unrelated fitness features.

Before making major architectural decisions, explain them simply. Since I am learning, keep explanations beginner-friendly. Generate clean project files and documentation, including README and instructions to run the app. After implementation, test the counting state machine against the test cases in the Markdown brief and report any limitations.

Do not change the core counting rule unless you ask me first.
```
