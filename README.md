# 🏆 Fitness Challenge App (FCA)

A modern React web application for fitness challenge tracking, progress monitoring, and social engagement. Built with React 19, TypeScript, and modern web technologies for an engaging fitness community experience.

## ✨ Features

### 🎯 Core Functionality

- **Smart Onboarding**: 4-step personalized onboarding flow with fitness goal selection
- **Challenge Management**: Create, browse, join, and leave fitness challenges with real-time updates
- **Progress Tracking**: Daily progress input with visual feedback and note-taking capabilities
- **Social Leaderboards**: Competitive rankings with real-time updates and achievement badges
- **Calendar Visualization**: Color-coded progress calendar with daily achievement tracking
- **User Settings**: Comprehensive profile management with notification preferences

### 🎨 UI/UX Features

- **Smooth Animations**: Framer Motion powered page transitions and component interactions
- **Responsive Design**: Mobile-first design with TailwindCSS 4.0
- **Real-time Feedback**: Instant toast notifications and loading states
- **Persistent Storage**: LocalStorage integration with Zustand for offline support
- **Modern Accessibility**: Keyboard navigation, screen reader support, and semantic HTML
- **Custom Components**: Reusable UI components with consistent design system

## 🛠️ Tech Stack

### Frontend Core

- **React**: v19.0.0 with modern functional components and hooks
- **TypeScript**: v5.7.2 with strict mode for type safety
- **Vite**: v6.2.0 for fast development and optimized builds
- **React Router DOM**: v7.3.0 for client-side routing

### State & Data Management

- **Zustand**: v5.0.3 for lightweight state management with persistence
- **TanStack React Query**: v5.67.3 for server state management and caching
- **Axios**: v1.8.3 for HTTP client operations

### Styling & UI

- **TailwindCSS**: v4.0.13 with custom utilities and responsive design
- **Framer Motion**: v12.15.0 for smooth animations and transitions
- **Lucide React**: v0.511.0 for consistent iconography

### Utilities & Tools

- **date-fns**: v4.1.0 for date manipulation and formatting
- **React Hot Toast**: v2.5.2 for notification system

### Development & Testing

- **Vitest**: v3.0.8 with React Testing Library for unit testing
- **ESLint**: v9.21.0 with TypeScript and React configuration
- **Prettier**: v3.5.3 for code formatting
- **Husky**: v9.1.7 for Git hooks

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18+ (recommended: 20+)
- **Package Manager**: pnpm (recommended) or npm
- **Git**: For version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kanechan25/clue-fca.git
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
   The app will be available at `http://localhost:5179`

### Build for Production

```bash
pnpm build && pnpm preview
# or
npm run build && npm run preview
```

## 📱 User Journey

### First-Time Setup

1. **Welcome Screen**: Introduction to the fitness challenge platform
2. **Profile Setup**: Enter name, email, and personal preferences
3. **Fitness Goals**: Select preferred challenge types and activity levels
4. **Preferences**: Configure units (metric/imperial) and notification settings

### Daily Workflow

1. **Dashboard**: View active challenges and quick progress stats
2. **Challenge Discovery**: Browse and filter available challenges
3. **Join Challenges**: One-click join with immediate leaderboard inclusion
4. **Daily Tracking**: Input progress with optional notes and photos
5. **Social Engagement**: View rankings, achievements, and share with friends

### Challenge Management

- **Create Challenges**: Set goals, duration, and invite participants
- **Progress Tracking**: Visual charts and calendar views
- **Leaderboard Competition**: Real-time rankings with achievement badges
- **Challenge Sharing**: Share achievements and invite friends

## 🏗️ Project Architecture

```
src/
├── components/              # Reusable UI components
│   ├── Common/             # Shared utility components
│   │   ├── Button.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── DatePicker.tsx
│   │   ├── Dropdown.tsx
│   │   └── Sharing.tsx
│   ├── ChallengeCard.tsx   # Challenge display component
│   ├── CreateChallengeModal.tsx # Challenge creation modal
│   ├── DailyInputForm.tsx  # Progress input form
│   ├── Leaderboard.tsx     # Ranking display
│   ├── Onboarding.tsx      # Multi-step onboarding flow
│   ├── ProgressSummary.tsx # Progress visualization
│   └── UserSettings.tsx    # User profile management
├── pages/                  # Route-level page components
│   ├── HomePage.tsx        # Main dashboard and challenge browser
│   └── ChallengeDetailPage.tsx # Individual challenge view
├── stores/                 # State management
│   └── fitnessStore.ts     # Zustand store with persistence
├── hooks/                  # Custom React hooks
│   └── useClickOutside.ts  # Outside click detection
├── types/                  # TypeScript definitions
│   └── index.ts           # All type definitions
├── utils/                 # Utility functions
│   ├── index.ts           # General utilities
│   └── format.ts          # Formatting helpers
├── constants/             # Application constants
│   ├── index.ts           # General constants
│   └── mock.ts            # Mock data for development
├── routes/                # Routing configuration
│   └── routes.tsx         # Route definitions
├── provider/              # Context providers
│   └── queryProvider.tsx  # React Query provider
├── assets/                # Static assets
│   └── css/               # Global styles
└── __test__/              # Test utilities and setup
    ├── setup.ts           # Test configuration
    ├── utils.tsx          # Test utilities
    └── units/             # Unit test files
```

## 🧪 Testing Strategy

### Test Setup

- **Vitest**: Fast unit testing with hot reload
- **React Testing Library**: Component testing with user-centric approach
- **Jest DOM**: Extended matchers for DOM testing
- **Coverage**: Comprehensive test coverage reporting

### Running Tests

```bash
# Development testing
pnpm test              # Interactive watch mode
pnpm test:ui          # Visual test runner interface
pnpm test:coverage    # Generate coverage reports

# CI/CD testing
pnpm test run         # Single run for CI environments
```

## Design Patterns Implemented

✅ **All 6 Target Patterns Successfully Applied:**

### 1. Container & Presentational (Applied in HomePage.tsx)

- Logic extracted to custom hooks and providers
- UI components receive props for pure rendering
- Clear separation of concerns

### 2. HOC Pattern (Applied to all pages)

- `withAuth` - Authentication wrapper
- `withLoading` - Loading state management
- `withToast` - Toast notification enhancement
- Usage: `export default withAuth(withLoading(withToast(HomePage)))`

### 3. Hooks Pattern (Headless Components)

- `useModal` - Modal state management
- `useToggle` - Boolean state toggle
- `useChallengeFiltering` - Challenge filtering/sorting logic (extracted from HomePage)
- `useForm` - Form state management

### 4. Provider Pattern (App-wide state)

- `AuthProvider` - User authentication state
- `ChallengeProvider` - Wraps existing Zustand store
- `NotificationProvider` - Centralized toast notifications
- All combined in `AppProviders`

### 5. Compound Components (Reusable UI systems)

- `Modal` - Modal.Content, Modal.Header, Modal.Body
- `Tabs` - Tabs.List, Tabs.Tab, Tabs.Panel (used in ChallengeDetailPage)
- `Dropdown` - Dropdown.Trigger, Dropdown.Content, Dropdown.Item
- `Form` - Form.Field, Form.Label, Form.Input

### 6. Headless Components

- All business logic extracted to custom hooks
- UI and logic completely separated
- Reusable across different components

## Real Implementation (No Examples!)

### HomePage.tsx - Fully Refactored

- ✅ Uses `useChallengeFiltering` for all filtering logic
- ✅ Uses `useModal` for create challenge modal
- ✅ Uses providers for data access (`useChallenge`, `useAuth`, `useNotification`)
- ✅ Enhanced with HOCs (`withAuth`, `withLoading`, `withToast`)
- ✅ Uses compound Modal component

### ChallengeDetailPage.tsx - Fully Refactored

- ✅ Uses compound Tabs component replacing manual tab logic
- ✅ Uses providers for data access
- ✅ Enhanced with HOCs
- ✅ Uses provider notifications instead of direct toast calls

### App.tsx - Updated

- ✅ Wrapped with `AppProviders` combining all context providers
- ✅ Preserves all original onboarding and routing logic

## Preserved Core Business Logic

**100% of original functionality maintained:**

- Challenge creation, joining, leaving
- Progress tracking and calculations
- Leaderboard generation
- Search, filtering, sorting algorithms
- User onboarding flow
- Toast notifications behavior
- Data persistence via Zustand
- All animations and UI layouts

## Benefits Achieved

1. **Better Separation of Concerns** - UI and logic cleanly separated
2. **Enhanced Reusability** - Components and hooks reusable across app
3. **Improved Testability** - Logic in hooks can be tested independently
4. **Better Code Organization** - Clear pattern-based structure
5. **Type Safety Preserved** - All TypeScript types maintained
6. **Performance Optimized** - Proper memoization in hooks and providers

## File Structure

```
src/
├── hocs/                 # Higher-Order Components
├── providers/            # React Context providers
├── hooks/headless/       # Business logic hooks
├── components/Compound/  # Compound component systems
├── pages/               # Main pages (refactored)
└── ...existing structure preserved
```

## Usage Examples

```tsx
// HOCs applied to pages
export default withAuth(withLoading(withToast(HomePage)))

// Providers usage
const { challenges, addChallenge } = useChallenge()
const { showSuccess } = useNotification()

// Headless hooks
const { filteredChallenges, searchQuery, setSearchQuery } = useChallengeFiltering(challenges, userProgress)

// Compound components
<Modal isOpen={isOpen} onClose={close}>
  <Modal.Content>
    <Modal.Header>Title</Modal.Header>
    <Modal.Body>Content</Modal.Body>
  </Modal.Content>
</Modal>
```

**No examples folder - everything applied directly to your actual code!**
