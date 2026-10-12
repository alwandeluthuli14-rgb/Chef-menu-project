# Chef's Menu Manager — MAST5112 POE Part 2

**Student:** Alwande Luthuli  
**Student number:** ST10509451  
**Development environment:** Expo / React Native  
**Run environment:** Android Studio Android Emulator or a physical Android device

## Features included

- Clean home/menu screen and an add-dish form
- Capture dish name, description, course and price in South African rand
- Add multiple menu items in one session
- Automatically refresh the menu list when an item is added
- Required-field validation and positive numeric price validation
- Field-level error messages and an alert if the form is incomplete
- Success alert and on-screen confirmation after saving
- Course options: Starter, Main, Dessert, Drink and Side
- Sample menu entries to demonstrate how the list looks

## Important scope note

This Part 2 version implements adding and displaying menu items, as requested in the Part 2 rubric. Editing, deleting, searching, filtering, statistics, and permanent database storage are not included. Menu entries are held in React state and will reset if the app is fully restarted. Remove or change the two sample entries in `App.js` if your lecturer expects the app to start with an empty menu.

## Requirements

- Node.js LTS
- Android Studio with an Android SDK and an emulator configured, or an Android phone
- Internet access for initial dependency installation

## Run the project

1. Extract the ZIP file.
2. Open the extracted `Chefs_Menu_Manager_Expo` folder in VS Code or Android Studio. Android Studio is useful for the emulator; use a terminal in the project folder for the Expo commands.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start Expo:

   ```bash
   npx expo start
   ```

5. To run on an Android emulator, start an emulator in Android Studio's Device Manager first. Then press `a` in the Expo terminal, or run:

   ```bash
   npx expo start --android
   ```

6. To run on a physical device, install Expo Go on the Android phone and scan the QR code shown in the terminal. Ensure the computer and phone are on the same network, where possible.

## Test checklist

- [ ] Tap **Add a dish** and try saving with all fields blank. Required-field errors should appear.
- [ ] Enter a dish name, description, course and a positive price.
- [ ] Save the dish. A success alert should appear and the app should return to the menu.
- [ ] Confirm the new dish appears with its course and price.
- [ ] Add a second dish and confirm both entries are visible.
- [ ] Try entering zero, a negative number or non-numeric price; the form should reject it.
- [ ] Check that the app remains readable when scrolling and when the keyboard opens.

## Submission notes

Submit the source files as required by your lecturer (for example, the project folder or a GitHub repository). Include screenshots of the running application and be prepared to demonstrate the validation and adding of multiple items. Do not claim that the application has been tested on your device until you have run it there.
