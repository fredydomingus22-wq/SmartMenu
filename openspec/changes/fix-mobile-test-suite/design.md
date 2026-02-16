## Context

React Native 0.81.5 introduces significant changes to the native bridge and TurboModules (New Architecture). In a standard Node environment like Jest, these modules are not initialized, leading to `Invariant Violation` errors. Additionally, the monorepo structure causes resolution failures for Expo's internal source files when `jest-expo` looks for them in relative `node_modules`.

## Goals / Non-Goals

**Goals:**

- Eliminate `Invariant Violation` related to bridge initialization.
- Support modern Flow syntax parsing in tests.
- Ensure consistent module resolution across different applications in the monorepo.
- Standardize the mobile testing environment.

**Non-Goals:**

- Migrate from Jest to Vitest for mobile (remains Jest due to industry standard/RN support).
- Implement E2E tests (out of scope for this infrastructure fix).

## Decisions

### 1. Early-Stage Global Injection via `jest.env.js`

We will use a separate `jest.env.js` file loaded via the `setupFiles` array in `jest.config.js`.

- **Rationale**: `setupFiles` runs before the test module is evaluated, allowing us to safely inject `global.__fbBatchedBridgeConfig` and `global.__turboModuleProxy` before React Native's internal logic can check for them.

### 2. Local Babel Preset Alignment

Each mobile app will have `babel-preset-expo` updated to `~54.0.0` in its own `devDependencies`.

- **Rationale**: This ensures the correct Babel plugins (including Flow support for `const` type params) are available locally to the app during Jest execution.

### 3. Explicit Module Mapping for Expo Internals

Use `moduleNameMapper` in `jest.config.js` to point to the root `node_modules` for specific failing paths like `expo/src/async-require/messageSocket`.

- **Rationale**: Solves resolution errors where regular Node resolution or Turborepo symlinking falls short during deep-source imports by `jest-expo` internals.

## Risks / Trade-offs

- **Risk**: Mocking `__turboModuleProxy` globally might mask genuine initialization issues that would occur on a real device.
- **Trade-off**: High developer friction (broken tests) vs. the small risk of missing a specific native module registration error in unit tests.
