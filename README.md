# 🏏 Wicket Love - Cricket Team Management Platform

A modern, mobile-first PWA for organizing casual cricket matches, managing teams, and tracking player performance.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Firebase](https://img.shields.io/badge/Firebase-12.2-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-cyan)

## ✨ Features

### 🔐 Authentication & Profiles
- One-tap Google Sign-in
- Comprehensive cricket player profiles
- Role selection (Batsman, Bowler, All-rounder, Wicket-keeper)
- Playing style preferences

### 👥 Groups & Community
- Create and manage cricket groups
- Invite members via code or QR
- Admin controls and settings
- Private/public group options

### 🏏 Match Organization
- Quick match creation
- Detailed match settings (format, ground, ball type)
- RSVP system with deadlines
- Real-time attendance tracking

### ⚖️ Smart Team Balance
- AI-powered team selection
- Rating-based balancing
- Role distribution (ensure each team has keepers, bowlers)
- Captain rotation tracking

### 📱 Communication
- WhatsApp integration
- One-click match sharing
- Group invite links
- Match reminders

### 📊 Performance Tracking
- Player ratings (ELO-style)
- Batting/bowling statistics
- Match history
- Achievements and milestones

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase account
- Google Cloud Console access (for OAuth)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Darthwares/WicketLove.git
cd wicket-love
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication (Google provider)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config to `.env.local`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, Shadcn/ui
- **Backend:** Firebase (Auth, Firestore, Storage)
- **State:** Zustand
- **Animations:** Framer Motion
- **PWA:** next-pwa
- **Deployment:** Vercel

## 📱 PWA Features

- Installable on mobile and desktop
- Offline support
- Push notifications (coming soon)
- App shortcuts
- Native app-like experience

## 🔧 Development

### Project Structure
```
wicket-love/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # Shadcn UI components
│   ├── auth/        # Authentication components
│   └── providers/   # Context providers
├── lib/             # Utilities and helpers
│   ├── firebase/    # Firebase configuration
│   ├── store/       # Zustand store
│   └── utils/       # Helper functions
├── types/           # TypeScript types
└── public/          # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run format` - Format code

## 🎯 Roadmap

### Phase 1 (MVP) ✅
- [x] Authentication
- [x] User profiles
- [x] Groups
- [x] Match creation
- [x] RSVP system
- [x] Team balancing
- [x] WhatsApp sharing

### Phase 2 (Coming Soon)
- [ ] Live match scoring
- [ ] Performance analytics
- [ ] Push notifications
- [ ] Tournament mode
- [ ] Weather integration
- [ ] Venue booking

### Phase 3 (Future)
- [ ] Video highlights
- [ ] Coaching features
- [ ] Equipment marketplace
- [ ] Sponsorships

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ for cricket lovers
- Icons by Lucide
- UI components by Shadcn/ui
- Hosting by Vercel

## 📞 Support

For support, email support@wicketlove.app or open an issue on GitHub.

---

**Live Demo:** [https://wicketlove.app](https://wicketlove.app)

**Documentation:** [View Full Documentation](./CLAUDE.md)

🤖 Built with [Claude Code](https://claude.ai/code)