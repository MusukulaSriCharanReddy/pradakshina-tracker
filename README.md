# Pradakshina Tracker

A simple, mobile-first app that automatically counts Pradakshina rounds.

## Core rule

**Start at Point A → Leave Point A → Return to Point A = Count +1.**

The user may walk any route and in any direction. The app does not validate the route, direction, shape, or whether the path went around a particular object. It detects departure from the registered starting area followed by a return.

## Documentation

- [Product requirements](PRODUCT_REQUIREMENTS.md)
- [Feature list](FEATURE_LIST.md)
- [Architecture report](ARCHITECTURE_REPORT.md)
- [Implementation plan](IMPLEMENTATION_PLAN.md)
- [Test plan](TEST_PLAN.md)
- [Agent instructions](AGENTS.md)

## Suggested MVP stack

Next.js, React, TypeScript, Tailwind CSS, Browser Geolocation API, and LocalStorage. Add PWA support after the core experience works.

## First milestone

Build a mobile-first interface with simulated-location mode. Prove that each simulated departure-and-return cycle increments exactly once. Then connect real GPS.

**Browser limitation:** foreground location tracking can be demonstrated in a web app, but background/screen-off tracking varies by browser and device. Do not promise it until tested on real devices.
