# 🚀 React Native Route Finder App

A cross-platform mobile app built with **React Native**, allowing users to search and select locations, view driving routes, and visualize paths on an interactive map.

---

## 📦 Features

### 🔹 Screen 1: Route Input

- Two input fields: `Start Point` & `End Point`
- Tap on either input to navigate to the **Location Search Screen**
- Once both are filled, the app fetches and displays available driving routes

### 🔹 Screen 2: Location Search

- **Live location search** using [OneMap Singapore API](https://www.onemap.gov.sg/docs/)
- Select a location from results to return back and populate input field

### 🔹 Screen 3: Route Map

- Fetch driving directions via [OSRM Routing API](http://project-osrm.org/)
- Route line drawn using `GeoJSON` data
- Map zooms and fits to show full route

---

## 🔥 Extra Features Implemented

- ✅ **Custom App Icon**
- ✅ **Animated Boot Splash Screen**
- ✅ **Location Permissions** (Android & iOS handled gracefully)
- ✅ **Toast Notification** when locations are not selected
- ✅ **Live Search** for places
- ✅ **Swap Start and End Points** instantly
- ✅ **Optimized UI/UX** with safe area support and gesture handling

### 🧩 Demo – Dynamic Bottom Sheet in Action

![Route Finder](RouteFinder.gif)

---

## 🛠 Setup Instructions

### 🔧 Prerequisites

- [React Native CLI Environment](https://reactnative.dev/docs/environment-setup)
- Android Studio / Xcode
- Node.js >= 14

---

### 📦 Install Dependencies

```bash
npm install
# or
yarn install
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```
