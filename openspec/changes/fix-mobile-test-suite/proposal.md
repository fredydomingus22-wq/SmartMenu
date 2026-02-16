## Why

The `admin-mobile` test suite is experiencing persistent `Invariant Violation` and module resolution errors due to a critical misalignment between Expo 54, React Native 0.81.5 (New Architecture), and the monorepo structure. Standard Jest setups fail to initialize the native bridge and TurboModules in a Node environment without specific early-stage injection of configurations and surgical mocks.

## What Changes

- **Early Environment Injection**: Introduction of `jest.env.js` to inject `__fbBatchedBridgeConfig` and `__turboModuleProxy` before module loading.
- **Standardized Tooling**: Aligning all mobile applications to `babel-preset-expo@~54.0.0` to support modern Flow/TS syntax used in RN 0.81 internals.
- **Module Resolution Fixes**: Explicit `moduleNameMapper` in Jest config to resolve hidden Expo internal sources (e.g., `async-require`).
- **Surgical Mocks**: Implementation of a robust `NativeModules` and `TurboModuleRegistry` proxy to prevent runtime crashes during tree inspection with RNTL.

## Capabilities

### New Capabilities

- `mobile-test-infrastructure`: A standardized, version-compatible Jest and Babel configuration baseline for all React Native / Expo applications within the monorepo.

### Modified Capabilities

<!-- No requirement changes to existing business logic, only infrastructure fixes. -->

## Impact

- **Affected Apps**: `admin-mobile`, `mobile`, `kds-mobile`.
- **System**: Development and CI/CD pipelines for mobile applications.
- **Dependencies**: Updates to `@babel/core`, `babel-preset-expo`, and Jest configurations.
