# Firebase Setup Instructions

## To fix the 400 Bad Request error, please follow these steps:

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/project/wicketlove-66015

### 2. Enable Firestore Database
1. Click on "Firestore Database" in the left sidebar
2. Click "Create database" if not already created
3. Choose "Start in production mode"
4. Select your preferred location (e.g., us-central1)
5. Click "Enable"

### 3. Set Firestore Security Rules
1. In Firestore, click on "Rules" tab
2. Replace the existing rules with the content from `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users for their own user document
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read and create groups
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid in resource.data.adminIds ||
        request.auth.uid in resource.data.memberIds
      );
      allow delete: if request.auth != null && request.auth.uid in resource.data.adminIds;
    }
    
    // Allow authenticated users to read and create matches
    match /matches/{matchId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Allow authenticated users to read and write performances
    match /performances/{performanceId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if false; // Performances should not be deleted
    }
  }
}
```

3. Click "Publish"

### 4. Configure Authentication
1. Go to "Authentication" in the sidebar
2. Click on "Settings" tab
3. Under "Authorized domains", make sure these are added:
   - localhost
   - wicketlove-66015.firebaseapp.com
   - Your production domain (if any)

### 5. Create Firestore Indexes (if needed)
If you see any index errors in the console:
1. Go to "Firestore Database" → "Indexes"
2. Click "Create Index"
3. Add composite indexes for:
   - Collection: `groups`, Fields: `memberIds` (Array), `__name__` (Ascending)
   - Collection: `matches`, Fields: `groupId` (Ascending), `status` (Ascending)

### 6. Enable Storage (Optional - for profile photos)
1. Click on "Storage" in the sidebar
2. Click "Get started"
3. Choose security rules mode
4. Select location
5. Click "Done"

### 7. Clear Browser Cache
1. Open Chrome DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 8. Test the App
1. Go to http://localhost:3000 (or your dev server port)
2. Try signing in with Google
3. Check browser console for any errors

## Common Issues and Solutions

### Issue: 400 Bad Request
**Solution:** Firestore is not enabled or rules are not configured properly.

### Issue: Permission Denied
**Solution:** Security rules are too restrictive. Check the rules above.

### Issue: Missing or insufficient permissions
**Solution:** User is not authenticated. Ensure Google sign-in completes successfully.

### Issue: Quota exceeded
**Solution:** Check Firebase usage limits in the console.

## Need Help?
- Firebase Documentation: https://firebase.google.com/docs
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Authentication Setup: https://firebase.google.com/docs/auth/web/google-signin