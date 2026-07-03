# GenAI Quotes - React Native App

A React Native (Expo) app that lets you browse and send motivational quotes about learning Generative AI. Quotes are sent via a dummy API and delivered as local push notifications.

## Features

- **Dummy Login** — Any email/password combo works (simulated auth with fake JWT token)
- **10 GenAI Quotes** — Curated quotes about getting started with GenAI and why to choose it
- **Dummy API** — All data flows through simulated API calls with realistic delays
- **Push Notifications** — Sending a quote triggers a real local push notification on device

## Project Structure

```
├── App.js                          # Entry point with navigation
├── src/
│   ├── data/
│   │   └── quotes.js              # 10 GenAI quotes
│   ├── screens/
│   │   ├── LoginScreen.js         # Dummy login screen
│   │   └── HomeScreen.js          # Quote list with send buttons
│   └── services/
│       ├── api.js                 # Dummy API (login, fetch, send)
│       └── notificationService.js # Push notification setup & trigger
├── package.json
├── app.json                       # Expo config
└── babel.config.js
```

## How to Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go app on your phone, or press `a` for Android emulator / `i` for iOS simulator.

## How It Works

1. **Login** — Enter any email and password. The dummy API returns a fake token.
2. **Browse Quotes** — All 10 quotes load via the simulated API.
3. **Send Quote** — Tap "Send as Notification" on any quote. This calls the dummy send API, then fires a local push notification with the quote text.

## Tech Stack

- React Native (Expo SDK 50)
- React Navigation (Native Stack)
- Expo Notifications (local push)
