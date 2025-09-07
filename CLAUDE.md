# Wicket Love - Development Guide for Claude

## 🎯 Project Overview
Wicket Love is a mobile-first PWA for cricket team management. This app helps casual cricket groups organize matches, create balanced teams based on player ratings, and track performance over time.

## 🏗️ Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **UI Components:** Shadcn/ui
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth (Google Provider)
- **Database:** Firestore
- **Storage:** Firebase Storage
- **State Management:** Zustand
- **PWA:** next-pwa
- **Deployment:** Vercel

## 🎨 Design System

### Color Palette
```css
--primary-green: #0F4C3A;    /* Cricket field */
--team-red: #DC2626;         /* Red team */
--team-blue: #1E40AF;        /* Blue team */
--accent-gold: #F59E0B;      /* Achievements/Premium */
--bg-light: #F9FAFB;
--text-primary: #111827;
--text-secondary: #6B7280;
```

### Typography
- **Headings:** font-bold with Inter/Montserrat
- **Body:** font-normal with Inter
- **Mobile Font Sizes:** Base 16px, scale 1.25

### Spacing
- Use Tailwind's spacing scale consistently
- Mobile padding: p-4 (16px)
- Card spacing: gap-4
- Section spacing: my-8

### Components Style Guide
- **Cards:** rounded-lg shadow-sm border
- **Buttons:** rounded-md with hover states
- **Forms:** Large touch targets (min 44px height)
- **Icons:** Lucide React icons, 20px default

## 📁 Project Structure
```
wicket-love/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── groups/
│   │   ├── matches/
│   │   └── profile/
│   ├── api/
│   │   ├── auth/
│   │   └── webhooks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           (Shadcn components)
│   ├── auth/
│   ├── dashboard/
│   ├── groups/
│   ├── matches/
│   └── shared/
├── lib/
│   ├── firebase/
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   └── config.ts
│   ├── utils/
│   │   ├── rating.ts
│   │   ├── team-balance.ts
│   │   └── whatsapp.ts
│   └── store/
│       └── index.ts
├── public/
│   ├── icons/
│   └── images/
└── types/
    └── index.ts
```

## 🔥 Firebase Configuration

### Collections Structure
```javascript
// Users Collection
users/{userId} {
  email: string;
  displayName: string;
  photoURL: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  battingStyle: 'right' | 'left';
  bowlingStyle: 'fast' | 'medium' | 'spin' | 'none';
  preferredPosition: 'opening' | 'middle' | 'lower';
  rating: number; // Starting: 1000
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
    economy: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Groups Collection
groups/{groupId} {
  name: string;
  description: string;
  photoURL: string;
  adminIds: string[];
  memberIds: string[];
  inviteCode: string;
  inviteLink: string;
  settings: {
    isPrivate: boolean;
    autoBalance: boolean;
    captainRotation: boolean;
  };
  createdAt: Timestamp;
  createdBy: string;
}

// Matches Collection
matches/{matchId} {
  groupId: string;
  title: string;
  date: Timestamp;
  venue: string;
  venueLocation: GeoPoint;
  format: 'T20' | 'ODI' | 'Test' | 'Custom';
  overs: number;
  groundType: 'turf' | 'matting' | 'concrete';
  ballType: 'leather' | 'tennis' | 'rubber';
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  rsvpDeadline: Timestamp;
  minPlayers: number;
  maxPlayers: number;
  teams: {
    red: {
      captainId: string;
      playerIds: string[];
    };
    blue: {
      captainId: string;
      playerIds: string[];
    };
  };
  rsvps: {
    [userId]: 'going' | 'maybe' | 'not-going';
  };
  createdAt: Timestamp;
  createdBy: string;
}

// Performances Collection
performances/{performanceId} {
  matchId: string;
  userId: string;
  team: 'red' | 'blue';
  batting: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    isOut: boolean;
    dismissalType: string;
  };
  bowling: {
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    wides: number;
    noBalls: number;
  };
  fielding: {
    catches: number;
    runOuts: number;
    stumpings: number;
  };
  ratingChange: number;
  newRating: number;
  createdAt: Timestamp;
}
```

### Security Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all users but only update their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Group members can read, admins can write
    match /groups/{groupId} {
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.memberIds;
      allow write: if request.auth != null && 
        request.auth.uid in resource.data.adminIds;
    }
    
    // Match access for group members
    match /matches/{matchId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/groups/$(resource.data.groupId)) &&
        request.auth.uid in get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.memberIds;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/groups/$(resource.data.groupId)) &&
        request.auth.uid in get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.adminIds;
    }
  }
}
```

## 🚀 Development Commands

### Initial Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add Firebase config to .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# WhatsApp (optional)
NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER=
```

## 🧩 Key Components

### Authentication Flow
1. User lands on public landing page
2. Clicks "Start Playing" → Google Sign-in
3. After auth → Check if profile exists
4. New user → Profile setup wizard
5. Existing user → Dashboard

### Team Balance Algorithm
```typescript
// lib/utils/team-balance.ts
function balanceTeams(players: Player[]): { red: Player[], blue: Player[] } {
  // 1. Sort players by rating
  // 2. Consider role distribution (batsmen, bowlers, keepers)
  // 3. Snake draft assignment (1-2-2-1 pattern)
  // 4. Ensure each team has at least 1 keeper if available
  // 5. Balance total team ratings
}
```

### Rating Calculation
```typescript
// lib/utils/rating.ts
function calculateNewRating(
  currentRating: number,
  performance: Performance,
  matchSettings: MatchSettings
): number {
  // Base formula: ELO-style rating
  // Factors:
  // - Batting: runs, strike rate, match impact
  // - Bowling: wickets, economy, match impact
  // - Fielding: catches, run-outs
  // - Ground/ball type multipliers
  // - Win/loss impact
}
```

### WhatsApp Integration
```typescript
// lib/utils/whatsapp.ts
function generateMatchShareMessage(match: Match): string {
  // Format match details for WhatsApp
  // Include: Date, time, venue, RSVP link
  // Use emojis for visual appeal
}

function getWhatsAppShareUrl(message: string, phoneNumber?: string): string {
  // Generate WhatsApp share URL
  // Support both web and mobile
}
```

## 🎯 MVP Checklist

### Phase 1: Core Setup ✅
- [ ] Initialize Next.js with TypeScript
- [ ] Set up Tailwind CSS
- [ ] Install and configure Shadcn/ui
- [ ] Set up Firebase project
- [ ] Configure Firebase Auth with Google
- [ ] Set up Firestore with security rules
- [ ] Configure next-pwa for PWA support

### Phase 2: Authentication
- [ ] Create landing page with hero section
- [ ] Implement Google Sign-in
- [ ] Build profile setup wizard
- [ ] Create user profile page
- [ ] Add profile edit functionality

### Phase 3: Groups
- [ ] Create group creation flow
- [ ] Generate invite links/QR codes
- [ ] Build group dashboard
- [ ] Add member management
- [ ] Implement join via link/code

### Phase 4: Matches
- [ ] Build match creation form
- [ ] Create match card component
- [ ] Implement RSVP functionality
- [ ] Add match details view
- [ ] Build attendance tracker

### Phase 5: Teams
- [ ] Implement team balance algorithm
- [ ] Create team selection UI
- [ ] Add captain assignment
- [ ] Build team reveal animation
- [ ] Add manual override for admins

### Phase 6: Dashboard
- [ ] Create user dashboard layout
- [ ] Build upcoming matches widget
- [ ] Add quick actions menu
- [ ] Implement match countdown
- [ ] Add recent activity feed

### Phase 7: Sharing
- [ ] Implement WhatsApp share for matches
- [ ] Create share templates
- [ ] Add copy invite link feature
- [ ] Generate QR codes for groups
- [ ] Build share preview cards

### Phase 8: PWA & Performance
- [ ] Configure PWA manifest
- [ ] Set up service worker
- [ ] Add offline support
- [ ] Optimize images and assets
- [ ] Implement lazy loading
- [ ] Add loading states and skeletons

### Phase 9: Polish
- [ ] Add micro-animations
- [ ] Implement haptic feedback (mobile)
- [ ] Add sound effects (optional)
- [ ] Create empty states
- [ ] Build error boundaries
- [ ] Add success notifications

### Phase 10: Testing & Launch
- [ ] Test auth flow end-to-end
- [ ] Test on multiple devices
- [ ] Fix responsive issues
- [ ] Performance optimization
- [ ] Deploy to Vercel
- [ ] Configure custom domain

## 📊 Performance Targets
- Lighthouse Score: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle Size: < 200KB (initial)

## 🐛 Common Issues & Solutions

### Firebase Auth Persistence
```typescript
// Ensure auth state persists
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
await setPersistence(auth, browserLocalPersistence);
```

### Firestore Offline Support
```typescript
// Enable offline persistence
import { enableIndexedDbPersistence } from 'firebase/firestore';
await enableIndexedDbPersistence(db);
```

### PWA Install Prompt
```typescript
// Handle PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install button
});
```

## 🔧 Debugging Tips
1. Use React DevTools for component debugging
2. Firebase Emulator Suite for local development
3. Chrome DevTools for PWA testing
4. Lighthouse for performance audits
5. Mobile device emulation for responsive testing

## 📝 Code Standards
- Use TypeScript strict mode
- Follow ESLint rules
- Implement proper error handling
- Add loading and error states
- Use semantic HTML
- Ensure accessibility (ARIA labels)
- Mobile-first responsive design
- Optimize for touch interactions

## 🚦 Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/feature-name
git add .
git commit -m "feat: add feature description"
git push origin feature/feature-name
# Create PR to main
```

## 📈 Monitoring & Analytics
- Firebase Analytics for user events
- Vercel Analytics for performance
- Sentry for error tracking (future)
- Custom events for feature usage

## 🎮 Testing Instructions
1. Test on real mobile devices (iOS & Android)
2. Test offline functionality
3. Test with slow network (3G)
4. Test auth flow with multiple accounts
5. Test responsive design (320px to 1920px)
6. Test accessibility with screen readers

## 🚀 Deployment Checklist
- [ ] Environment variables configured
- [ ] Firebase project in production mode
- [ ] Security rules reviewed and tested
- [ ] PWA manifest validated
- [ ] Meta tags and SEO configured
- [ ] Analytics tracking enabled
- [ ] Error boundaries in place
- [ ] Loading states implemented
- [ ] Mobile testing completed
- [ ] Performance audit passed

## 💡 Future Enhancements
1. Live match scoring
2. Video highlights integration
3. Weather API integration
4. Push notifications
5. Tournament mode
6. Player achievements/badges
7. Social features (comments, likes)
8. Venue booking integration
9. Equipment marketplace
10. Coaching features

---

*Remember: Focus on mobile-first, keep it simple, and make it delightful!*

*Last Updated: MVP Launch Night*
- always use bun to install manage packages