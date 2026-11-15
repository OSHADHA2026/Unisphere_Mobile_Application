# UniSphere (mobile app)

Campus companion app built with **Expo (React Native) + Expo Router**, styled with **NativeWind / Gluestack UI** and using **TanStack Query** for server state.

## Getting started

```bash
npm install
cp .env.example .env        # set EXPO_PUBLIC_API_URL to your backend
npx expo start
```

For EAS builds, set `EXPO_PUBLIC_API_URL` in the EAS environment used by the build profile (for example, `preview` for preview builds). The local `.env` file is gitignored and is not included in cloud builds.

| Script              | Purpose                    |
| ------------------- | -------------------------- |
| `npm start`         | Start the Expo dev server  |
| `npm run android`   | Run on Android             |
| `npm run ios`       | Run on iOS                 |
| `npm run web`       | Run on web                 |
| `npm run lint`      | ESLint (Expo config)       |
| `npm run typecheck` | TypeScript (`tsc --noEmit`)|

## Project structure

```
app/            Routes only (Expo Router). Keep screens thin: compose components + hooks.
features/       One folder per domain: auth, profile, events, housing, lost,
                marketplace, studyGroup, tutors, home.
                Each contains its own components/, hooks/ (and services/, types/ if needed).
components/     Shared, feature-agnostic UI (AppHeader, Footer/tab bar, SearchInput, FilterChips).
  common/       Design-system building blocks: Screen, ScreenHeader, FeedScreen, FormScreen,
                AppText, Button, Card, Badge, TextField, OptionChips, PhotoPicker, EmptyState...
  feedback/     Modals and sheets (LoginRequiredModal, ConfirmDeleteModal, ConfirmModal,
                SuccessModal, ActionSheet).
  ui/           Gluestack UI primitives (generated; avoid editing).
constants/      config.ts (env + storage keys), colors.ts (light/dark palette), theme.ts (spacing, radius, layout).
context/        React context providers (ThemeContext).
hooks/          Shared hooks used across features (useUser, useFilteredList).
lib/            Cross-cutting helpers (queryKeys).
services/       API client (axios) and storage wrapper.
utils/          Pure helpers (timeAgo, imageUrl, updateChecker).
```

### Conventions

- **Routes stay in `app/`; everything else lives elsewhere.** Anything inside `app/` becomes a URL, so hooks and components must not be placed there.
- Import with the `@/` alias (e.g. `@/features/events/hooks/useEvents`), not long relative paths.
- Reach for `queryKeys` (`@/lib/queryKeys`) instead of string literals when using React Query.
- Read env vars only through `@/constants/config`; use `STORAGE_KEYS` for storage keys.
- Use `resolveImageUrl()` for backend image paths and the shared modals in `components/feedback`.

### UI conventions

- Every page is `<Screen header=... tabBar? fab? bottomBar?>`: header, content, bottom action bar and tab bar are stacked in a column, so nothing floats over content.
- Browse pages use `FeedScreen`; create/edit pages use `FormScreen` + `TextField` / `OptionChips` / `PhotoPicker`.
- Use `AppText` (variants/tones), `Button`, `Card`, `Badge` and the tokens in `constants/theme.ts` and `constants/colors.ts` instead of ad-hoc styles or hard-coded colors, so light/dark mode and spacing stay consistent.
- Use `RemoteImage` for backend images: it shows a placeholder if the image is missing or fails to load.

## App size & memory

- **APK size:** `app.json` uses `expo-build-properties` with `buildArchs: ["armeabi-v7a", "arm64-v8a"]`, so the APK no longer ships the emulator-only x86 / x86_64 native libraries. For the smallest sideload APK on modern phones use only `["arm64-v8a"]`. For the Play Store build an Android App Bundle (`eas build -p android --profile production`), which delivers only the user's CPU variant.
- **Images:** use `RemoteImage` (backed by `expo-image`) for all remote pictures. It decodes at display size and caches, which keeps memory low in long lists. Image pickers use reduced quality (0.5–0.6) for smaller uploads.
- **Known remaining cost:** event images are stored as base64 text in the database and sent inside the events list. Moving them to Supabase Storage URLs (backend change) would cut both memory use and data usage noticeably.
