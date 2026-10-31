# Architecture Report

## 1. Recommended architecture

Use a small client-side Next.js app. Keep the counting engine independent from the UI and location provider so it can be tested using simulated coordinates.

```text
Next.js UI (Setup / Tracking / Summary)
                 |
          Session Controller
          /               \\
 Location Provider     Local Storage
 (GPS / Simulator)          |
          |
     Counting Engine
 (accuracy + distance + state machine)
```

## 2. Suggested folder structure

```text
pradakshina-tracker/
├── public/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── TargetSelector.tsx
│   │   ├── TrackingDashboard.tsx
│   │   ├── ProgressDisplay.tsx
│   │   ├── TrackingStatus.tsx
│   │   └── SessionControls.tsx
│   ├── lib/
│   │   ├── counting-engine.ts
│   │   ├── geo-utils.ts
│   │   ├── location-provider.ts
│   │   ├── simulated-location-provider.ts
│   │   └── session-storage.ts
│   ├── hooks/
│   │   └── use-pradakshina-session.ts
│   └── types/
│       └── session.ts
├── docs/
├── AGENTS.md
└── README.md
```

Adapt this to the actual existing project. Do not recreate a project or overwrite files unnecessarily.

## 3. Counting state machine

States:
- `IDLE`: no active session.
- `WAITING_FOR_DEPARTURE`: Point A saved; waiting to leave departure boundary.
- `WAITING_FOR_RETURN`: user departed; waiting to re-enter return boundary.
- `PAUSED`: ignore location samples for counting.
- `COMPLETED`: target reached.

Transitions:

```text
IDLE --Start + valid GPS--> WAITING_FOR_DEPARTURE
WAITING_FOR_DEPARTURE --reliably outside departure radius--> WAITING_FOR_RETURN
WAITING_FOR_RETURN --reliably inside return radius--> count += 1
count event --> WAITING_FOR_DEPARTURE
active state --Pause--> PAUSED
PAUSED --Resume--> previous tracking state
count >= target --> COMPLETED
```

A return counts regardless of the path or direction. Do not inspect the path between departure and return.

## 4. GPS approach

- Use Browser Geolocation API for the initial web prototype.
- Save starting latitude/longitude as Point A.
- Calculate distance to Point A using a tested Haversine helper.
- Reject unusable accuracy readings and stale timestamps.
- Require multiple stable readings or a short confirmation window.
- Use separate departure and return thresholds (hysteresis) to reduce GPS boundary flapping.

Initial experimental values only:
- Departure radius: about 15–20 metres.
- Return radius: about 5–8 metres.
- Experiment with maximum reported accuracy around 20 metres.

These are not guaranteed values. Keep them configurable and test on real devices. GPS may be unsuitable for small or covered temple spaces.

## 5. Duplicate prevention

After a valid return increments the count, transition to `WAITING_FOR_DEPARTURE`. Do not increment again until a new reliable departure has occurred.

## 6. Minimal data model

```ts
type TrackingState =
  | "idle"
  | "waiting-for-departure"
  | "waiting-for-return"
  | "paused"
  | "completed";

type LocationPoint = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

type PradakshinaSession = {
  id: string;
  target: number;
  count: number;
  startPoint: LocationPoint;
  state: TrackingState;
  startedAt: number;
  updatedAt: number;
};
```

## 7. Location provider abstraction

Keep GPS and simulation interchangeable:

```ts
interface LocationProvider {
  start(
    onLocation: (point: LocationPoint) => void,
    onError: (error: Error) => void
  ): void;
  stop(): void;
}
```

The simulator should feed test coordinates around Point A into the same counting engine used by GPS.

## 8. Platform limitations

- Geolocation needs permission and a secure context (HTTPS or localhost).
- Browser behavior varies when backgrounded or screen-locked.
- Do not promise reliable background tracking in the PWA MVP.
- Test on a real Android phone.
- If reliable background tracking is essential, evaluate native Android or cross-platform mobile development later.

## 9. Privacy

Request location only when a session starts. Explain why it is needed. Keep location on-device in the MVP; do not transmit it to a server.
