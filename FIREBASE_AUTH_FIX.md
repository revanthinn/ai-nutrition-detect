# 🔥 Firebase Auth Configuration Fix

## 🚨 **Error: `auth/configurationnotfound`**

This error occurs when Firebase Authentication is not properly enabled in your Firebase project. Here's how to fix it:

## 🔧 **Step-by-Step Fix**

### Step 1: Enable Firebase Authentication

1. **Go to Firebase Console**:
   - Visit: [https://console.firebase.google.com/project/ai-dish](https://console.firebase.google.com/project/ai-dish)

2. **Enable Authentication**:
   - Click on "Authentication" in the left sidebar
   - Click "Get started" if you haven't enabled it yet
   - Go to "Sign-in method" tab

3. **Enable Email/Password Provider**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### Step 2: Verify Project Configuration

Make sure your Firebase project has these settings:

**Project ID**: `ai-dish`
**Web App ID**: `1:586649288979:web:f932c82215d0902a061ae6`

### Step 3: Check Firebase Console Access

If you can't access the Firebase Console:

1. **Verify Project Ownership**:
   - Make sure you have access to the `ai-dish` project
   - Check if you're logged in with the correct Google account

2. **Alternative: Create New Project**:
   If you don't have access, create a new Firebase project:

## 🆕 **Create New Firebase Project (Alternative)**

If you don't have access to the existing project, create a new one:

### Step 1: Create New Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it `ai-nutrition-detect` (or any name you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Add Web App
1. Click the web icon (`</>`)
2. Register app with name: `AI Nutrition Detect`
3. Copy the configuration object

### Step 3: Update Configuration
Replace the config in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-new-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### Step 4: Enable Services
1. **Authentication**: Enable Email/Password
2. **Firestore**: Create database
3. **Storage**: Enable storage

## 🔍 **Debugging Steps**

### Check 1: Verify Firebase Project
Run this in your browser console:

```javascript
import { auth } from './src/lib/firebase';
console.log('Auth instance:', auth);
console.log('Auth config:', auth.config);
```

### Check 2: Test Firebase Connection
```javascript
import { app } from './src/lib/firebase';
console.log('Firebase app:', app);
console.log('App name:', app.name);
console.log('App options:', app.options);
```

### Check 3: Check Network Requests
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to sign in
4. Look for failed requests to Firebase

## 🚀 **Quick Fix Script**

Run this diagnostic script in your browser console:

```javascript
// Firebase Auth Diagnostic Script
async function diagnoseFirebaseAuth() {
  console.log('🔍 Diagnosing Firebase Auth...');
  
  try {
    // Check if Firebase is loaded
    console.log('Firebase loaded:', typeof firebase !== 'undefined');
    
    // Check auth instance
    const { auth } = await import('./src/lib/firebase');
    console.log('Auth instance:', auth);
    console.log('Auth app:', auth.app);
    console.log('Auth config:', auth.config);
    
    // Test auth methods
    console.log('Auth methods available:', Object.getOwnPropertyNames(auth.__proto__));
    
    // Check if project is accessible
    const { app } = await import('./src/lib/firebase');
    console.log('Firebase app:', app);
    console.log('App options:', app.options);
    
  } catch (error) {
    console.error('❌ Firebase Auth Error:', error);
    console.log('Error details:', error.message);
    
    if (error.code === 'auth/configuration-not-found') {
      console.log('💡 Solution: Enable Firebase Authentication in console');
    }
  }
}

diagnoseFirebaseAuth();
```

## 🎯 **Most Likely Solutions**

### Solution 1: Enable Auth in Console
1. Go to Firebase Console
2. Enable Authentication
3. Enable Email/Password provider

### Solution 2: Check Project Access
1. Verify you have access to `ai-dish` project
2. Check if you're logged in with correct account

### Solution 3: Create New Project
1. Create new Firebase project
2. Update configuration
3. Enable all required services

## 📞 **Need Help?**

If you're still having issues:

1. **Share the exact error message** from browser console
2. **Check Firebase Console access** - can you see the project?
3. **Try creating a new project** if you don't have access

The most common cause is simply that Firebase Authentication isn't enabled in the project console! 🔥
