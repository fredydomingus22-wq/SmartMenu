const path = require('path');

module.exports = {
  preset: 'jest-expo',
  setupFiles: [
    path.resolve(__dirname, './jest.env.js'),
  ],
  setupFilesAfterEnv: [
    '@testing-library/react-native/extend-expect',
    path.resolve(__dirname, './jest.setup.js'),
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        configFile: path.resolve(__dirname, './babel.config.js'),
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?((current-app-to-transpile|@smart-menu/.*|react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)))',
  ],
  moduleNameMapper: {
    '^react$': path.resolve(__dirname, '../../node_modules/react'),
    '^react-test-renderer$': path.resolve(__dirname, '../../node_modules/react-test-renderer'),
    '^react-native$': 'react-native',
    '^expo/src/async-require/messageSocket$': path.resolve(__dirname, '../../node_modules/expo/src/async-require/messageSocket.ts'),
    '^expo/src/async-require/messageSocket.native$': path.resolve(__dirname, '../../node_modules/expo/src/async-require/messageSocket.native.ts'),
  },
};
