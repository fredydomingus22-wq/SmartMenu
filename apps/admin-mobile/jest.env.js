// This file runs BEFORE the test file and BEFORE setupFilesAfterEnv
// It is used to inject globals required by React Native 0.81.5 internals

global.__fbBatchedBridgeConfig = {
  remoteModuleConfig: [],
};

global.__turboModuleProxy = (name) => {
  const constants = {
    PlatformConstants: {
      forceTouchAvailable: false,
      isTesting: true,
      reactNativeVersion: { major: 0, minor: 81, patch: 5 },
    },
    NativePlatformConstantsIOS: {
      forceTouchAvailable: false,
      isTesting: true,
      reactNativeVersion: { major: 0, minor: 81, patch: 5 },
    },
    NativePlatformConstantsAndroid: {
      isTesting: true,
      reactNativeVersion: { major: 0, minor: 81, patch: 5 },
    },
    SourceCode: {
      scriptURL: 'bundle.js',
    },
    StatusBarManager: {
      getHeight: jest.fn((cb) => cb({ height: 20 })),
      setStyle: jest.fn(),
      setHidden: jest.fn(),
    },
    DeviceInfo: {
      Dimensions: {
        window: { width: 375, height: 812, scale: 3, fontScale: 1 },
        screen: { width: 375, height: 812, scale: 3, fontScale: 1 },
      },
      isIPhoneX_deprecated: true,
    },
  };

  const moduleMock = constants[name] || {};
  
  return {
    getConstants: () => moduleMock,
    ...moduleMock,
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  };
};

global.IS_REACT_ACT_ENVIRONMENT = true;
global.IS_REACT_NATIVE_TEST_ENVIRONMENT = true;
global.__DEV__ = true;
