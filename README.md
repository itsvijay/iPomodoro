# iPomodoro - Focus Better, Achieve More

A modern, sleek Pomodoro timer built with Next.js 14, TypeScript, and Tailwind CSS. Boost your productivity with the Pomodoro Technique in a beautiful, distraction-free interface.

## ✨ Features

- **Modern Design**: Sleek, glass-morphism UI with dark/light mode support
- **Customizable Timers**: Adjust focus, short break, and long break durations
- **Progress Tracking**: Monitor your productivity with detailed statistics
- **Smart Notifications**: Sound and browser notifications for timer completion
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Persistent Settings**: Your preferences are saved locally
- **Session Analytics**: Track your focus patterns and productivity trends

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd iPomodoro
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives

## 📱 Features Overview

### Timer Functionality
- 25-minute focus sessions (customizable)
- 5-minute short breaks (customizable)
- 15-minute long breaks (customizable)
- Automatic phase transitions
- Session completion tracking

### Customization
- Adjustable timer durations
- Sound notification toggle
- Browser notification settings
- Auto-start options
- Dark/light theme switching

### Analytics
- Daily session tracking
- Focus time statistics
- Productivity trends
- Time distribution charts
- Performance insights

## 🎨 Design Principles

- **Minimalist**: Clean, distraction-free interface
- **Accessible**: WCAG compliant with proper contrast ratios
- **Responsive**: Mobile-first design approach
- **Modern**: Glass-morphism and gradient effects
- **Intuitive**: Easy-to-use controls and navigation

## 📁 Project Structure

```
iPomodoro/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── PomodoroTimer.tsx  # Main timer component
│   ├── SettingsModal.tsx  # Settings panel
│   └── StatsPanel.tsx     # Analytics dashboard
├── store/                  # State management
│   └── pomodoroStore.ts   # Zustand store
├── lib/                    # Utility functions
│   └── utils.ts           # Helper functions
└── public/                 # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🌟 Best Practices Implemented

- **Performance**: Optimized with Next.js 14 features
- **SEO**: Proper meta tags and Open Graph support
- **Accessibility**: ARIA labels and keyboard navigation
- **Code Quality**: TypeScript strict mode and ESLint
- **User Experience**: Smooth animations and transitions
- **Responsive**: Mobile-first design approach

## 📈 Future Enhancements

- [ ] User authentication and cloud sync
- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Custom themes and personalization
- [ ] Integration with productivity tools
- [ ] Mobile app development
- [ ] Offline support with PWA

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for productivity enthusiasts