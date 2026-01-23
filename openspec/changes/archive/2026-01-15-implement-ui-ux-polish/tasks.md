# Tasks: UI/UX Polish

- [ ] **Infrastructure**
  - [x] Install `framer-motion` and `@storybook/nextjs` in `apps/web`. <!-- id: 1 -->
  - [ ] Configure Storybook to read Tailwind and Global CSS. <!-- id: 2 -->

- [ ] **Theming Engine**
  - [x] Define core CSS variables in `globals.css` (`--primary`, `--primary-foreground`, etc.). <!-- id: 3 -->
  - [x] Update `tailwind.config.ts` to use these variables. <!-- id: 4 -->
  - [x] Refactor `PublicMenuPage` to use semantic classes instead of `orange-600`. <!-- id: 5 -->

- [ ] **Animations & UX**
  - [x] Implement `FadeIn` transition for Menu Items using `framer-motion`. <!-- id: 6 -->
  - [ ] Add button feedback (scale-down) on click. <!-- id: 7 -->

- [ ] **Component Documentation**
  - [x] Create Storybook stories for `Button`, `Card`, and `MenuItemCard`. <!-- id: 8 -->
  - [x] Create Storybook stories for `QRGenerator`. <!-- id: 9 -->

- [ ] **Validation**
  - [ ] Run full build to ensure no visual regressions. <!-- id: 10 -->
  - [ ] Verify Storybook renders component variants correctly. <!-- id: 11 -->
