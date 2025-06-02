# 🏆 Fitness Challenge App

A modern React web application for fitness challenge tracking, progress monitoring, and social engagement with friends.

## ✨ Features

### 🎯 Core Functionality

- **Onboarding Flow**: Welcome walkthrough with personal fitness goal selection
- **Challenge Management**: Browse, join, and leave fitness challenges
- **Progress Tracking**: Daily input and visualization of fitness progress
- **Social Features**: Leaderboards and friend competition
- **Calendar View**: Visual progress calendar with color-coded achievements

### 🎨 UI/UX Features

- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Real-time Updates**: Instant feedback with toast notifications
- **Offline Support**: LocalStorage persistence with sync capabilities
- **Accessibility**: Keyboard navigation and screen reader support

### 📊 Challenge Types

- 🚶 **Daily Steps**: Track walking goals
- 🏃 **Running/Distance**: Monitor distance covered
- 🔥 **Calorie Burn**: Track calories burned
- ⚖️ **Weight Management**: Monitor weight loss progress
- 💪 **Workout Time**: Track exercise duration

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **State Management**: Zustand with persistence
- **Styling**: TailwindCSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd clue-fca
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5179`

### Build for Production

```bash
pnpm build
# or
npm run build
```

### Run Tests

```bash
pnpm test
# or
npm test
```

## 📱 Usage Guide

### First Time Setup

1. **Onboarding**: Complete the 4-step onboarding process

   - Welcome screen
   - Profile setup (name, email)
   - Fitness goals selection
   - Preferences configuration

2. **Explore Challenges**: Browse available fitness challenges on the home page

3. **Join a Challenge**: Click "Join Challenge" on any challenge card

4. **Track Progress**: Use the daily input form to log your progress

5. **View Progress**: Check your progress in multiple views:
   - Progress summary with circular charts
   - Calendar view with color-coded days
   - Leaderboard rankings

### Key Features

#### 🏠 Home Page

- Search and filter challenges
- View joined challenges with progress previews
- Quick stats dashboard
- Leaderboard preview

#### 📊 Challenge Detail Page

- **Progress Tab**: Track daily progress with input forms
- **Leaderboard Tab**: See rankings and compete with others
- **Calendar Tab**: Visual progress calendar

#### 🎯 Progress Tracking

- Daily value input with validation
- Optional notes for each entry
- Real-time progress calculations
- Visual feedback with animations

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChallengeCard.tsx
│   ├── ProgressSummary.tsx
│   ├── Leaderboard.tsx
│   ├── DailyInputForm.tsx
│   └── Onboarding.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   └── ChallengeDetailPage.tsx
├── stores/             # Zustand stores
│   └── fitnessStore.ts
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── routes/             # Routing configuration
│   └── routes.tsx
└── assets/             # Static assets and styles
    └── css/
```

### TailwindCSS

The app uses TailwindCSS 4.0 with custom utilities for animations and responsive design.

## 📊 Data Management

### State Management

- **Zustand**: Lightweight state management with persistence
- **LocalStorage**: Automatic persistence of user data and progress
- **Mock Data**: Pre-populated challenges and leaderboards for development

### Data Structure

```typescript
interface Challenge {
  id: string
  name: string
  description: string
  type: ChallengeType
  goal: number
  unit: string
  duration: number
  startDate: Date
  endDate: Date
  participants: number
  creator: string
  isActive: boolean
}

interface UserProgress {
  challengeId: string
  userId: string
  dailyEntries: DailyProgress[]
  totalProgress: number
  rank?: number
  joined: Date
  completed: boolean
}
```

## 🎨 Design System

### Colors

- **Primary**: Blue gradient (#3B82F6 to #2563EB)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray Scale**: Tailwind gray palette

### Typography

- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, etc.)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Animations

- **Page Transitions**: Fade and slide effects
- **Component Animations**: Scale, bounce, and pulse effects
- **Progress Animations**: Smooth progress bar fills and circular progress

## 🧪 Testing

The app includes comprehensive testing setup:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

### Netlify

1. Connect repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **TailwindCSS** for utility-first styling
- **Zustand** for simple state management
- **Lucide React** for beautiful icons
- **React Hot Toast** for notifications

---

Built with ❤️ using React and TypeScript
