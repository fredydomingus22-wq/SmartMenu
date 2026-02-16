// 1. Injected the missing bridge config global BEFORE any RN imports
global.__fbBatchedBridgeConfig = {
  remoteModuleConfig: [],
};

// 2. Mock requireNativeComponent to avoid native view registration errors
jest.mock('react-native/Libraries/ReactNative/requireNativeComponent', () => {
  const React = require('react');
  return (name) => {
    const Component = (props) => React.createElement(name, props, props.children);
    Component.displayName = name;
    return Component;
  };
});

// 3. Mock other common native dependencies
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// 4. Set globals expected by RN
global.IS_REACT_ACT_ENVIRONMENT = true;
global.IS_REACT_NATIVE_TEST_ENVIRONMENT = true;
global.__DEV__ = true;
