Act as a Senior React Native Developer. Create a complete, functional mobile application called "GymTrack" using Expo, TypeScript, and React Navigation. In Spanish language

### Tech Stack & Style

- **Framework:** React Native (Expo SDK 50+).
- **Language:** TypeScript.
- **Styling:** StyleSheet (or NativeWind if configured) focusing on a minimal, modern UI.
- **Navigation:** React Navigation (Stack Navigator + Bottom Tab Navigator).
- **State Management:** React Context API or Zustand (for managing routines and logs).
- **Persistence:** AsyncStorage (to save routines and progress locally).

### Design System

- **Colors:**
  - Background: White (#FFFFFF)
  - Text/Primary: Charcoal Gray (#1A1A1A)
  - Muscle Accents: Legs (#4A90E2), Back (#50E3C2), Chest (#E05050), Arms (#F5A623).
  - UI Elements: Soft shadows (elevation: 5), Rounded corners (borderRadius: 12-16).
- **Typography:** Clean sans-serif (system font is fine, strictly readable).

### Core Features & Architecture

Please scaffold the app structure and implement the following screens/logic:

#### 1. Global State

Create a Context/Store to handle:

- User profile (name).
- Routines (Array: id, name, category, exercises[]).
- Daily Logs (Array: date, routineId, completed status).
- Functions: `addRoutine`, `deleteRoutine` (with undo capability), `logWorkout`.

#### 2. Navigation Structure

- **AuthStack:** Onboarding -> Login -> Register.
- **MainTab:** Home | Routines | Calendar | Profile.

#### 3. Screen Implementation Details

**A. Onboarding (Swiper/Carousel)**

- 3 Slides as described (Welcome, Organize, Visualize).
- CTA: "Comenzar" navigates to Auth.

**B. Auth (Login/Register)**

- Mock authentication (just visualize the fields and store a user token in state).
- Clean inputs with rounded borders.

**C. Home Dashboard**

- Greeting: "Hola, [User]".
- Date display.
- Summary Cards: "Routine scheduled for today" (check logs) and "Weekly Progress".

**D. Routines Management (CRUD)**

- **List View:** Show created routines. Max 5 allowed.
- **Create/Edit Screen:** - Input: Name.
  - Category Picker (Select Color/Type).
  - Dynamic List: Add Exercises (Name, Sets, Reps).
- **UX Rule:** Confirm dialog before deleting.

**E. Calendar (Progress)**

- Use a library like `react-native-calendars`.
- Mark dates with dots/backgrounds corresponding to the routine's muscle color.
- **Interaction:** Tap a day -> Open Modal -> Show Routine Details -> Edit/Delete option.

**F. Log Workout (Registrar Rutina)**

- Screen to select an existing routine and mark it as "Done" for today.

**G. Settings/Profile**

- Edit Name.
- Reset Data (Clear AsyncStorage).

### UX/UI Requirements

- **Error Prevention:** Use React Native `Alert` for confirmations on delete actions.
- **Feedback:** Use a simple Toast/Snackbar component when a routine is saved or deleted.
- **Layout:** Use Flexbox for responsive design. Ensure padding and safe areas are respected.

### Output

Start by setting up the project structure, creating the types, the theme constants, and the main navigation setup. Then implement the screens iteratively.
