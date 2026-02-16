## 1. Environment & Base Configuration

- [ ] 1.1 Update `admin-mobile/package.json` with `babel-preset-expo@~54.0.0` and run install
- [ ] 1.2 Create `admin-mobile/jest.env.js` with global bridge and TurboModule mocks

## 2. Jest & Babel Refinement

- [ ] 2.1 Update `admin-mobile/jest.config.js` with `setupFiles` and `moduleNameMapper` for Expo internals
- [ ] 2.2 Update `admin-mobile/babel.config.js` to align with Expo 54 requirements

## 3. Verification & Scaling

- [ ] 3.1 Verify `admin-mobile` with `npx jest src/sanity.test.tsx`
- [ ] 3.2 Replicate configuration alignment to `mobile` application
- [ ] 3.3 Replicate configuration alignment to `kds-mobile` application
- [ ] 3.4 Replicate configuration alignment to `rider-mobile` application
