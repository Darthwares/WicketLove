# Wicket Love - Product Requirements Document

## 🏏 Product Vision
Wicket Love is a mobile-first cricket team management platform that simplifies organizing casual cricket matches, managing teams, and tracking player performance. It creates a delightful experience for cricket enthusiasts to organize games, form balanced teams, and build their cricket community.

## 🎯 Problem Statement
Casual cricket groups struggle with:
- Organizing matches and confirming player attendance
- Creating balanced teams fairly
- Tracking player performance over time
- Communicating match details effectively
- Managing group rotations for captaincy and playing positions

## 👥 Target Audience
- **Primary:** Casual cricket groups (weekend warriors, office teams, community groups)
- **Secondary:** Amateur cricket clubs and leagues
- **Age Range:** 18-45 years
- **Tech Savvy:** Moderate to high smartphone usage
- **Geography:** Initially English-speaking cricket-playing nations

## 🌟 Core Value Propositions
1. **Instant Team Balance:** AI-powered team selection based on player ratings and roles
2. **Effortless Organization:** One-click match creation and WhatsApp integration
3. **Fair Play System:** Automatic captain rotation and position preferences
4. **Performance Insights:** Track your cricket journey with detailed statistics
5. **Community Building:** Connect with cricket lovers in your area

## 📱 Design Principles

### Visual Design
- **Theme:** Modern, energetic, cricket-inspired
- **Primary Colors:** 
  - Deep Green (#0F4C3A) - Cricket field
  - Vibrant Red (#DC2626) - Red team
  - Royal Blue (#1E40AF) - Blue team
  - Gold Accent (#F59E0B) - Premium features/achievements
- **Typography:** 
  - Headers: Bold, sporty font (Inter/Montserrat)
  - Body: Clean, readable (Inter/System UI)
- **Iconography:** Custom cricket-themed icons (bat, ball, stumps, gloves)

### UX Principles
1. **Mobile-First:** Thumb-friendly navigation, one-handed operation
2. **Speed:** Maximum 2 taps to any core feature
3. **Clarity:** Clear CTAs, intuitive flow
4. **Delight:** Micro-animations on achievements, smooth transitions
5. **Accessibility:** High contrast, clear labels, voice-over support

## 🚀 MVP Features (Launch Tonight)

### 1. Authentication & Onboarding
- **Google Sign-in:** One-tap authentication via Firebase Auth
- **Profile Setup Wizard:**
  - Upload profile photo (with crop/edit)
  - Select playing role (Batsman/Bowler/All-rounder/Wicket-keeper)
  - Choose batting style (Right/Left handed)
  - Choose bowling style (Fast/Medium/Spin/None)
  - Set position preferences (Opening, Middle order, Lower order)
- **Welcome Animation:** Cricket-themed onboarding screens

### 2. User Dashboard
- **Hero Section:** Next match countdown timer with weather widget
- **Upcoming Matches Card:**
  - Match date, time, venue
  - Attendance status (Going/Maybe/Can't)
  - Quick RSVP buttons
  - Team announcement status
- **Quick Actions:**
  - Create Match (floating action button)
  - Join Group (enter code or scan QR)
  - View Stats

### 3. Groups Management
- **Create Group:**
  - Group name and description
  - Group photo upload
  - Privacy settings (Public/Private)
  - Auto-generate shareable invite link
  - QR code for quick joining
- **Group Dashboard:**
  - Member list with roles
  - Upcoming matches
  - Group statistics
  - Admin controls

### 4. Match Creation & Management
- **Match Setup:**
  - Date, time, venue (with map integration)
  - Match format (T20/ODI/Test/Custom overs)
  - Ground type (Turf/Matting/Concrete)
  - Ball type (Leather/Tennis/Rubber)
  - RSVP deadline
  - Min/Max players
- **Team Selection:**
  - Auto-balance algorithm based on ratings
  - Manual override for admins
  - Captain selection (rotation tracking)
- **Live Match Features:**
  - Attendance tracking
  - Last-minute team adjustments

### 5. Performance Tracking
- **Post-Match Recording:**
  - Batting: Runs, balls faced, 4s, 6s, strike rate
  - Bowling: Overs, wickets, runs conceded, economy
  - Fielding: Catches, run-outs, stumpings
- **Rating Algorithm:**
  - Base rating: 1000 points
  - Performance-weighted adjustments
  - Ground/ball type multipliers
  - Consistency bonus

### 6. Communication & Sharing
- **WhatsApp Integration:**
  - Share match details with formatted message
  - Send reminders to group
  - Share match results
- **In-App Notifications:**
  - Match reminders
  - Team announcements
  - RSVP deadlines

## 🎨 User Experience Flow

### First-Time User Journey
1. **Landing Page** (3 seconds to wow)
   - Hero: "Organize Cricket. Build Teams. Track Stats."
   - Live match counter animation
   - Single CTA: "Start Playing"
   
2. **Authentication** (10 seconds)
   - Google sign-in with cricket ball loading animation
   
3. **Profile Setup** (30 seconds)
   - Guided wizard with progress indicator
   - Skip option for quick start
   
4. **Dashboard** (Immediate value)
   - Tutorial overlay highlighting key features
   - Sample match card to explore
   - Prompt to create/join first group

### Returning User Flow
1. **Dashboard** (Instant access)
   - Upcoming match front and center
   - One-tap RSVP
   
2. **Quick Actions** (2 taps max)
   - Create match → Pre-filled with group defaults
   - View teams → Visual team cards

## 🔧 Technical Specifications

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI Components:** Shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **PWA:** next-pwa for offline capability

### Backend
- **Authentication:** Firebase Auth (Google Provider)
- **Database:** Firestore
- **Storage:** Firebase Storage (profile images)
- **Hosting:** Vercel
- **Analytics:** Firebase Analytics

### Performance Targets
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90
- **Offline Support:** Core features available

## 📊 Success Metrics

### Launch Night (MVP)
- 10 test users successfully create accounts
- 5 groups created
- 3 matches organized
- Zero critical bugs

### Week 1
- 100 registered users
- 50% create or join a group
- 30% organize a match
- 4.5+ app store rating

### Month 1
- 1,000 active users
- 500 matches organized
- 80% user retention
- 50% weekly active users

## 🚦 MVP Feature Priority

### Must Have (Tonight)
1. Google Authentication ✅
2. User profiles with roles ✅
3. Create/join groups ✅
4. Create matches ✅
5. RSVP to matches ✅
6. Basic team selection ✅
7. Share via WhatsApp ✅

### Should Have (Week 1)
1. Performance recording
2. Rating calculation
3. Captain rotation
4. Weather integration
5. Push notifications

### Could Have (Month 1)
1. Advanced statistics
2. Player achievements
3. Group tournaments
4. Venue booking integration
5. Equipment management

### Won't Have (Future)
1. Live scoring
2. Video highlights
3. Coaching features
4. Merchandise store
5. Sponsorship management

## 🎯 MVP User Stories

### Authentication
- As a user, I want to sign in with Google so I can quickly access the app
- As a user, I want to set up my cricket profile so others know my playing style

### Groups
- As a group admin, I want to create a group so I can organize matches
- As a user, I want to join a group via link so I can participate in matches

### Matches
- As a group admin, I want to create a match so players can RSVP
- As a player, I want to see upcoming matches so I can plan my availability
- As a player, I want to RSVP to matches so organizers know my availability

### Teams
- As a group admin, I want the app to create balanced teams so matches are competitive
- As a player, I want to see which team I'm on before the match

### Sharing
- As a user, I want to share match details on WhatsApp so I can invite friends

## 🎨 Wow Factors

### Delighters for Launch
1. **Animated Cricket Ball Loader:** Spinning ball during loading states
2. **Team Reveal Animation:** Dramatic reveal of team selections
3. **Streak Counter:** Shows consecutive match attendance
4. **Smart Notifications:** "Your usual Saturday match is tomorrow!"
5. **Quick Stats Card:** "You've played 10 matches this month!"

### Micro-interactions
- Swipe to RSVP (left: can't, right: attending)
- Pull to refresh with cricket ball bounce
- Haptic feedback on team selection
- Sound effects (optional): bat hitting ball on success actions

## 📱 Mobile-First Responsive Design

### Breakpoints
- Mobile: 320px - 768px (primary focus)
- Tablet: 768px - 1024px
- Desktop: 1024px+ (enhanced experience)

### Key Mobile Optimizations
- Bottom navigation bar for thumb reach
- Swipe gestures for navigation
- Floating action button for quick match creation
- Card-based UI for easy scanning
- Progressive disclosure for complex forms

## 🔐 Security & Privacy

### Data Protection
- OAuth 2.0 for authentication
- Encrypted data transmission
- Secure Firebase rules
- GDPR compliance ready

### User Privacy
- Optional location sharing
- Private group settings
- Data export capability
- Account deletion option

## 🌍 Internationalization (Future)

### Phase 1 Languages
- English (Default)
- Hindi
- Urdu

### Localization
- Date/time formats
- Number formats
- RTL support ready

## 📈 Analytics & Tracking

### Key Events to Track
- User registration completion
- Group creation
- Match creation
- RSVP rate
- Team satisfaction (post-match survey)
- Feature usage patterns

## 🚀 Launch Plan

### Tonight's Checklist
1. Deploy MVP to Vercel
2. Configure Firebase project
3. Test auth flow end-to-end
4. Create demo group with sample data
5. Generate WhatsApp share templates
6. Quick smoke test on mobile devices

### Success Criteria for Tonight
- [ ] Users can sign up and create profile
- [ ] Users can create and join groups
- [ ] Users can create matches and RSVP
- [ ] Basic team selection works
- [ ] WhatsApp sharing functional
- [ ] Mobile responsive design complete
- [ ] No critical bugs in core flow

## 📝 Post-MVP Roadmap

### Week 1-2
- Performance tracking system
- Advanced rating algorithm
- Push notifications
- Captain rotation logic

### Month 1-2
- Tournament mode
- Player statistics dashboard
- Achievement system
- Social features (comments, likes)

### Quarter 1
- Venue partnership
- Equipment marketplace
- Coaching integration
- Sponsored tournaments

## 🎯 North Star Metric
**Weekly Active Matches:** Number of matches organized and played through the platform per week

## 💡 Innovation Opportunities
1. AI-powered team predictions
2. AR for toss visualization
3. Voice commands for score entry
4. Smart scheduling based on weather
5. Integration with fitness trackers

---

*This PRD is a living document and will be updated based on user feedback and market insights.*

*Version 1.0 - MVP Launch Night*