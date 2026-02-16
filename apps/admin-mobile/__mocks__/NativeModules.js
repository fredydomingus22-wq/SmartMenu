module.exports = {
  __fbBatchedBridgeConfig: {
    remoteModuleConfig: [],
  },
  default: {
    StatusBarManager: {
      getHeight: jest.fn(),
    },
    DeviceEventEmitter: {
      addListener: jest.fn(),
    },
    SourceCode: {
      scriptURL: 'https://mock.url',
    },
    UIManager: {},
    NativeUnimoduleProxy: {
      viewManagersMetadata: {},
      modulesConstants: {
        ExponentConstants: {
          experienceUrl: {
            mock: 'exp://mock',
          },
        },
      },
    },
    Linking: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      openURL: jest.fn(),
      canOpenURL: jest.fn(),
      getInitialURL: jest.fn(),
    },
  },
};
