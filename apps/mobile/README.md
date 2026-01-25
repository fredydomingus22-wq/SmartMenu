# SmartMenu Mobile App

A React Native mobile application for SmartMenu built with Expo.

## Overview

The SmartMenu mobile app provides a native mobile experience for restaurant customers, featuring menu browsing, cart management, and secure ordering capabilities.

## Features

- 🍽️ **Menu Browsing**: Browse restaurant menu with categories and search
- 🛒 **Cart Management**: Add items, manage quantities, offline cart
- 👤 **User Authentication**: Secure login with token storage
- 📱 **Native Experience**: Optimized for iOS and Android
- 🎨 **Shared Design**: Consistent UI with web application

## Tech Stack

- **Framework**: Expo SDK 54 + React Native
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React hooks + Context (future)
- **Storage**: Expo SecureStore
- **UI Components**: Shared @smart-menu/ui package
- **Styling**: React Native StyleSheet

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (macOS) or Android Studio (all platforms)

### Installation

```bash
# From monorepo root
npm install

# Navigate to mobile app
cd apps/mobile

# Install dependencies
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Or run directly on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator/Device
npm run web      # Web browser (for testing)
```

## 🧪 Testing Guide

### Quick Start Test

```bash
# 1. Start the app
npm start

# 2. Scan QR code with Expo Go app

# 3. Test core features:
# - Navigate between tabs (Home, Menu, Cart, Profile)
# - Add items to cart from Menu screen
# - Manage cart quantities and checkout
# - Test offline functionality
```

### Comprehensive Testing

For detailed testing instructions, see:
- **[TEST_GUIDE.md](./TEST_GUIDE.md)** - Complete testing guide
- **Key Test Scenarios:**
  - Cart management and persistence
  - Payment flow simulation
  - Offline-first functionality
  - Navigation and UX

### Test Checklist

- [ ] App launches without errors
- [ ] Navigation between screens works
- [ ] Cart functionality (add/remove items)
- [ ] Checkout process completes
- [ ] Offline mode indicators appear
- [ ] No TypeScript compilation errors

## Project Structure

```
apps/mobile/
├── src/
│   ├── components/     # Shared mobile components
│   ├── navigation/     # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/        # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── MenuScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── LoginScreen.tsx
│   ├── services/       # API services and utilities
│   └── types/          # TypeScript type definitions
├── assets/             # Images and static assets
├── App.tsx            # Main app component
└── app.json           # Expo configuration
```

## Key Components

### Navigation

The app uses React Navigation with a stack navigator for authentication flow and bottom tabs for main navigation.

```tsx
// AppNavigator.tsx
- Stack Navigator: Login → Main App
- Bottom Tabs: Home, Menu, Cart, Profile
```

### Screens

- **LoginScreen**: Authentication with email/password
- **HomeScreen**: Welcome dashboard with quick actions
- **MenuScreen**: Menu browsing with categories and search
- **CartScreen**: Cart management with totals and checkout
- **ProfileScreen**: User profile and settings

### Shared Components

The app integrates components from `@smart-menu/ui`:

```tsx
import { Button } from '@smart-menu/ui';
import { ImageUpload } from '@smart-menu/ui';
```

## Configuration

### Environment Variables

The mobile app requires the following environment variables (configured in consuming apps):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Secure Storage

Authentication tokens are stored securely using Expo SecureStore:

```tsx
import * as SecureStore from 'expo-secure-store';

// Store token
await SecureStore.setItemAsync('auth_token', token);

// Retrieve token
const token = await SecureStore.getItemAsync('auth_token');
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow React Native and Expo best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

### Component Patterns

```tsx
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export default function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

### State Management

Currently using React hooks. Consider Context API or Redux for complex state management in the future.

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Building for Production

### iOS

```bash
# Build for iOS
npx expo build:ios

# Or use EAS Build
npx eas build --platform ios
```

### Android

```bash
# Build for Android
npx expo build:android

# Or use EAS Build
npx eas build --platform android
```

## Deployment

### Expo Application Services (EAS)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build and submit
eas build --platform ios
eas build --platform android
```

### App Store Deployment

1. **iOS**: Build with EAS, then upload to App Store Connect
2. **Android**: Build with EAS, then upload to Google Play Console

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **iOS simulator not starting**: Ensure Xcode is installed and Simulator is available
3. **Android build issues**: Check Android SDK and emulator setup

### Performance

- Use `React.memo` for expensive components
- Implement proper key props for FlatList
- Optimize images with appropriate sizes
- Use Hermes engine for better performance

## Contributing

1. Follow the established code patterns
2. Test on both iOS and Android
3. Ensure accessibility compliance
4. Update documentation for new features
5. Create appropriate TypeScript types

## Security

- Never store sensitive data in AsyncStorage
- Use SecureStore for tokens and credentials
- Implement proper input validation
- Follow OWASP mobile security guidelines

## License

Internal use only - SmartMenu proprietary.