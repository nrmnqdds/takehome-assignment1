# React Native Authentication App

A modern React Native authentication application built with Expo, featuring login/signup functionality, persistent authentication state, and real-time form validation.

## 📋 Table of Contents

- [Demo Video](#demo-video)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Features Documentation](#features-documentation)
- [Architecture](#architecture)
- [Testing the App](#testing-the-app)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## 🎥 Demo Video

Watch a complete walkthrough of the application features and functionality:

[![Demo Video](https://img.shields.io/badge/Watch-Demo%20Video-red?style=for-the-badge&logo=youtube)](https://r2.quddus.my/demo1-compressed.mp4)

### What's Covered in the Demo:

- 📱 **App Overview** - Navigation and screen flow
- 🔐 **Signup Process** - Creating a new account with validation
- ✅ **Real-time Validation** - Inline error messages and feedback
- 🔑 **Login Flow** - Authenticating with existing credentials
- 🏠 **Home Screen** - User information display
- 💾 **Persistence** - App restart while staying logged in
- 🚪 **Logout** - Signing out functionality
- 👁️ **Password Toggle** - Show/hide password feature
- ✓ **Password Match** - Visual confirmation indicator
- ❌ **Error Handling** - Validation and authentication errors

## ✨ Features

### Core Features (Assignment Requirements)

- ✅ **Authentication Context** - Global state management using React Context API
- ✅ **Login Screen** - Email/password authentication with validation
- ✅ **Signup Screen** - User registration with name, email, and password
- ✅ **Home Screen** - Display logged-in user information with logout
- ✅ **Form Validation** - Real-time and on-blur validation with inline error messages
- ✅ **Navigation** - Seamless navigation between auth and app screens
- ✅ **Persistent Authentication** - User stays logged in using AsyncStorage
- ✅ **Protected Routes** - Main app only accessible when authenticated

### Bonus Features

- ✅ **Password Visibility Toggle** - Eye icon to show/hide passwords
- ✅ **Password Match Indicator** - Real-time visual feedback for password confirmation
- ✅ **Real-time Validation** - Instant feedback as users type
- ✅ **Path Aliases** - Clean imports using `@/` syntax
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Result Objects** - Predictable error handling without throwing exceptions
- ✅ **Professional UI** - Modern, clean design with iOS-style components

## 🛠 Tech Stack

- **Framework**: React Native 0.81.4
- **Platform**: Expo SDK 54
- **Language**: TypeScript 5.9.2
- **Navigation**: React Navigation 7.x
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Icons**: @expo/vector-icons (AntDesign)
- **UI**: React Native core components

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** (optional, but recommended):
  ```bash
  npm install -g expo-cli
  ```
- **iOS Simulator** (Mac only) or **Android Studio** for emulators
- **Expo Go** app on your physical device (optional)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd takehome-assignment1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install additional peer dependencies** (if needed)
   ```bash
   npx expo install
   ```

## 🎯 Running the App

### Development Server

Start the Expo development server:

```bash
npm start
```

Or with cache cleared:

```bash
npx expo start -c
```

### Running on iOS Simulator (Mac only)

```bash
npm run ios
```

### Running on Android Emulator

```bash
npm run android
```

### Running on Physical Device

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code displayed in the terminal
3. The app will load on your device

### Web Version

```bash
npm run web
```

## 📁 Project Structure

```
takehome-assignment1/
├── src/
│   ├── assets/                  # Images and static assets
│   │   ├── bell.png
│   │   └── newspaper.png
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.tsx     # Authentication state management
│   │   └── index.ts            # Context exports
│   ├── navigation/              # Navigation configuration
│   │   ├── screens/
│   │   │   ├── auth/           # Authentication screens
│   │   │   │   ├── Login.tsx   # Login screen
│   │   │   │   ├── Signup.tsx  # Signup screen
│   │   │   │   └── index.ts
│   │   │   ├── Home.tsx        # Home screen (logged in)
│   │   │   ├── Profile.tsx     # User profile screen
│   │   │   ├── Settings.tsx    # Settings screen
│   │   │   ├── Updates.tsx     # Updates screen
│   │   │   └── NotFound.tsx    # 404 screen
│   │   └── index.tsx           # Navigation setup
│   ├── App.tsx                  # Root component
│   └── types.d.ts              # TypeScript type definitions
├── index.tsx                    # Entry point
├── babel.config.js              # Babel configuration (path aliases)
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 📖 Features Documentation

### 1. Authentication Context (`src/context/AuthContext.tsx`)

The authentication state is managed globally using React Context API.

**Interface:**

```typescript
interface AuthContextType {
  user: User | null; // Current user or null
  isLoading: boolean; // Loading state
  login: (params) => Promise<AuthResult>;
  signup: (params) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
}
```

**User Object:**

```typescript
interface User {
  name: string;
  email: string;
  id: string;
}
```

**Result Object Pattern:**

```typescript
interface AuthResult {
  success: boolean;
  error?: string;
}
```

**Key Features:**

- Global authentication state
- Persistent storage with AsyncStorage
- Type-safe operations
- Result objects instead of throwing errors
- Automatic state loading on app start

**Usage:**

```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (!result.success) {
      console.log(result.error);
    }
  };
}
```

### 2. Login Screen (`src/navigation/screens/auth/Login.tsx`)

**Features:**

- Email and password input fields
- Real-time validation as user types
- On-blur validation
- Password visibility toggle with eye icon
- Loading states during authentication
- Inline error messages beneath fields
- Navigation to Signup screen

**Validation Rules:**

- **Email**: Required, valid format (`user@domain.com`)
- **Password**: Required, minimum 6 characters

**Error Messages:**

- "Email is required"
- "Email address is incomplete"
- "Password is required"
- "Password must be at least 6 characters"
- "Invalid email or password" (from server)

**User Flow:**

1. User enters email and password
2. Validation occurs on blur or as typing (password)
3. Submit triggers full validation
4. Errors shown inline beneath fields
5. Successful login navigates to Home screen
6. Failed login shows alert with error message

### 3. Signup Screen (`src/navigation/screens/auth/Signup.tsx`)

**Features:**

- Name, email, password, and confirm password fields
- Real-time validation as user types
- On-blur validation
- Password visibility toggle (password field only)
- Password match indicator with visual feedback
- Loading states during registration
- Inline error messages beneath fields
- Navigation to Login screen

**Validation Rules:**

- **Name**: Required, minimum 2 characters
- **Email**: Required, valid format
- **Password**: Required, minimum 6 characters
- **Confirm Password**: Required, must match password

**Password Match Indicator:**

- ✓ **Green checkmark** + green border when passwords match
- ✗ **Red X** + red border when passwords don't match
- Shows "Passwords match" or error message beneath field

**Error Messages:**

- "Name is required"
- "Name must be at least 2 characters"
- "Email is required"
- "Email address is incomplete"
- "Password is required"
- "Password must be at least 6 characters"
- "Please confirm your password"
- "Passwords do not match"
- "User with this email already exists" (from server)

**User Flow:**

1. User fills in registration form
2. Real-time validation provides immediate feedback
3. Password match indicator shows status
4. Submit triggers full validation
5. Errors shown inline beneath fields
6. Successful signup automatically logs user in
7. Failed signup shows alert with error message

### 4. Home Screen (`src/navigation/screens/Home.tsx`)

**Features:**

- Displays logged-in user's name and email in a card
- Logout button with confirmation dialog
- Navigation to Profile and Settings screens
- Welcome message

**User Information Displayed:**

```
Welcome!
Name: [User's Name]
Email: [User's Email]
```

**Logout Flow:**

1. User taps "Logout" button
2. Confirmation dialog appears
3. User confirms
4. AuthContext clears user state and AsyncStorage
5. Navigation automatically returns to Login screen

### 5. Real-Time Inline Validation

**Validation Triggers:**

- **On Blur**: Validates when user leaves a field
- **On Change**: Real-time validation for password fields
- **On Submit**: Validates all fields before submission

**Visual Indicators:**

- **Red border** (`#E53935`) on invalid fields
- **Error text** beneath field in red
- **Disappears** immediately when user starts correcting

**Smart Display Logic:**

- Only shows errors after field is "touched" (blurred)
- Clears errors as user types corrections
- Prevents annoying premature error messages

### 6. Persistent Authentication

**Implementation:**

- Uses `@react-native-async-storage/async-storage`
- Stores current user in `@auth_user` key
- Stores all registered users in `@auth_users` key
- Automatically loads user on app start
- Shows loading screen while checking storage

**Storage Keys:**

```typescript
AUTH_STORAGE_KEY = "@auth_user"; // Current logged-in user
USERS_STORAGE_KEY = "@auth_users"; // All registered users
```

**Flow:**

```
App Start
  ↓
Check AsyncStorage for @auth_user
  ↓
  ├─ User found → Set user state → Show main app
  └─ No user → Show login/signup screens
```

### 7. Navigation Structure

**Auth Stack** (Unauthenticated):

- Login Screen
- Signup Screen

**Main Stack** (Authenticated):

- Home Tabs
  - Home Screen (Feed)
  - Updates Screen
- Profile Screen
- Settings Screen
- About Screen
- 404 Not Found

**Conditional Rendering:**

```typescript
export function Navigation(props) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <AuthNavigation />;
  return <MainNavigation />;
}
```

### 8. Path Aliases

Clean imports using `@/` prefix instead of relative paths.

**Configuration:**

- `tsconfig.json`: TypeScript path mapping
- `babel.config.js`: Runtime module resolution

**Example:**

```typescript
// ❌ Old way
import { useAuth } from "../../../context/AuthContext";

// ✅ New way
import { useAuth } from "@/context/AuthContext";
```

### 9. Form State Management

Uses single state object pattern for cleaner code:

```typescript
interface SignupFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  showPassword: boolean;
}

const [formState, setFormState] = useState<SignupFormState>({...});

const updateFormField = (field: keyof SignupFormState, value: string | boolean) => {
  setFormState((prev) => ({ ...prev, [field]: value }));
};
```

**Benefits:**

- Single `useState` instead of multiple
- Type-safe field updates
- Unified update function
- Easier to extend

### 10. Error Handling Pattern

Uses result objects instead of throwing exceptions:

```typescript
// ✅ Returns result object
const result = await login({ email, password });

if (!result.success && result.error) {
  Alert.alert("Login Failed", result.error);
}

// ❌ No try-catch needed
```

**Benefits:**

- Predictable control flow
- Type-safe
- No exception handling
- Cleaner code
- Easier to test

## 🏗 Architecture

### State Management

```
AuthProvider (Context)
    ↓
Navigation (checks auth state)
    ↓
├─ Auth Stack (if not logged in)
│   ├─ Login
│   └─ Signup
└─ Main Stack (if logged in)
    ├─ Home
    ├─ Profile
    └─ Settings
```

### Data Flow

```
User Action
    ↓
Component calls AuthContext function
    ↓
AuthContext performs operation
    ↓
Returns AuthResult { success, error? }
    ↓
Component handles result
    ↓
AuthContext updates state (if successful)
    ↓
Navigation responds to state change
```

### Validation Flow

```
User Input
    ↓
Update form state
    ↓
Clear existing error for that field
    ↓
On Blur: Validate field
    ↓
Show error if invalid
    ↓
On Submit: Validate all fields
    ↓
Show all errors if invalid
    ↓
Proceed if valid
```

## 🧪 Testing the App

### Test Scenario 1: New User Signup

1. **Start the app** (should show Login screen)
2. **Tap "Sign Up"**
3. **Enter invalid data**:
   - Name: "J" → Shows "Name must be at least 2 characters"
   - Email: "test" → Shows "Email address is incomplete"
   - Password: "12345" → Shows "Password must be at least 6 characters"
   - Confirm: "123456" → Shows "Passwords do not match"
4. **Correct the errors**:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm: "password123" → Green checkmark appears
5. **Tap "Sign Up"**
6. **Expected**: User is registered and logged in, Home screen appears

### Test Scenario 2: Login

1. **On Login screen**
2. **Enter credentials**:
   - Email: "john@example.com"
   - Password: "password123"
3. **Tap "Login"**
4. **Expected**: User is logged in, Home screen appears

### Test Scenario 3: Persistence

1. **Log in as a user**
2. **Close the app completely** (swipe up from app switcher)
3. **Reopen the app**
4. **Expected**: User is still logged in, Home screen appears immediately

### Test Scenario 4: Logout

1. **On Home screen** (logged in)
2. **Tap "Logout"**
3. **Confirm logout** in dialog
4. **Expected**: User is logged out, Login screen appears

### Test Scenario 5: Validation

1. **On Signup screen**
2. **Try to submit empty form**
3. **Expected**: All fields show error messages
4. **Enter invalid email**: "notanemail"
5. **Blur field**
6. **Expected**: "Email address is incomplete" appears
7. **Start typing in password field**
8. **Expected**: Error appears in real-time as you type

### Test Scenario 6: Password Toggle

1. **On Login screen**
2. **Enter password**
3. **Tap eye icon**
4. **Expected**: Password becomes visible
5. **Tap eye icon again**
6. **Expected**: Password is hidden again

## 🐛 Troubleshooting

### Issue: App won't start

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Clear Expo cache
npx expo start -c
```

### Issue: TypeScript errors

**Solution:**

```bash
# Run TypeScript check
npx tsc --noEmit

# Check for missing types
npm install --save-dev @types/react @types/react-native
```

### Issue: AsyncStorage not working

**Solution:**

```bash
# Reinstall AsyncStorage
npm install @react-native-async-storage/async-storage

# Rebuild the app
npx expo prebuild
npm run ios  # or npm run android
```

### Issue: Path aliases not working

**Solution:**

1. Check `babel.config.js` has module-resolver plugin
2. Check `tsconfig.json` has paths configuration
3. Restart Metro bundler: `npx expo start -c`
4. Restart TypeScript server in IDE

### Issue: Navigation doesn't update after login

**Solution:**

- Ensure `AuthProvider` wraps the entire `Navigation` component in `App.tsx`
- Check that the context is being consumed correctly with `useAuth()`

### Issue: Validation not showing

**Solution:**

- Check that field has been "touched" (blurred)
- Verify error state is being set correctly
- Check conditional rendering logic in component
