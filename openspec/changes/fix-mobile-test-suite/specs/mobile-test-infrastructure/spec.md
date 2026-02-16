## ADDED Requirements

### Requirement: Early Environment Initialization

The test environment SHALL initialize the React Native bridge and TurboModule proxy before any application or library code is loaded.

#### Scenario: Prevent Invariant Violation

- **WHEN** a test file starts execution
- **THEN** `global.__fbBatchedBridgeConfig` MUST be defined
- **AND** `global.__turboModuleProxy` MUST be defined

### Requirement: Modern Flow and TypeScript Transpilation

The testing infrastructure SHALL support transpilation of modern Flow syntax used in React Native 0.81 internals, specifically `const` type parameters.

#### Scenario: Transpile ViewConfigIgnore

- **WHEN** Jest loads `react-native/Libraries/NativeComponent/ViewConfigIgnore.js`
- **THEN** it MUST correctly parse the `ConditionallyIgnoredEventHandlers<const T>` syntax without syntax errors.

### Requirement: Monorepo Module Resolution

The testing infrastructure SHALL correctly resolve internal Expo source modules located in the root `node_modules` relative to the application directory.

#### Scenario: Resolve Expo messageSocket

- **WHEN** `@testing-library/react-native` or `jest-expo` requires `expo/src/async-require/messageSocket`
- **THEN** the module MUST be resolved to the physical location in the monorepo root.

### Requirement: Generic Native Module Mocking

The system SHALL provide a generic fallback for any Native or Turbo Module that is not explicitly mocked, to prevent "Module is not registered" or "Invariant Violation" errors during tree rendering.

#### Scenario: Unmocked TurboModule Fallback

- **WHEN** a component uses an unmocked TurboModule
- **THEN** the `__turboModuleProxy` MUST return a generic object with `getConstants`, `addListener`, and `removeListeners` methods.
