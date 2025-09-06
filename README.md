# Dev Codex - Project Management Platform

A modern, clean full-stack development platform designed for developers and teams to organize, track, and collaborate on projects. Built with TypeScript, featuring complete type safety, modular architecture, and zero code duplication.

## 🚀 Features

### Core Project Management
- **Project Organization**: Create, organize, and track multiple development projects
- **Todo Management**: Task tracking with priorities and completion status  
- **Notes System**: Rich text notes with individual entries per project
- **Development Log**: Track progress and document development milestones
- **Documentation Templates**: Pre-built templates for APIs, models, routes, and more
- **Tech Stack Tracking**: Monitor technologies and packages used in projects
- **Deployment Management**: Track deployment status, platforms, commands, and environment variables

### Team Collaboration
- **Team Management**: Invite members with role-based permissions (owner/editor/viewer)
- **Project Sharing**: Share projects publicly or with specific team members
- **Notifications**: Real-time notifications for invitations and team activities
- **Public Discovery**: Discover public projects from other developers

### Advanced Features
- **Analytics Dashboard**: Track user engagement and project activity with leaderboards
- **Activity Tracking**: Real-time collaboration indicators and user session tracking
- **Billing Integration**: Stripe-powered subscription management with plan tiers
- **Admin Panel**: User management and system analytics for administrators
- **Public Pages**: Public profile and project pages with customizable visibility
- **Export System**: Export project data in multiple formats (JSON, Markdown, PDF)

### Real-time Features
- **Live Collaboration**: See active users and real-time activity indicators
- **Session Tracking**: Track user sessions and project engagement
- **Activity Logs**: Comprehensive logging of user actions and project changes
- **Notifications**: Real-time notifications for team activities and updates

### Security & Performance
- **Authentication**: JWT-based auth with Google OAuth integration
- **Rate Limiting**: API protection with intelligent rate limiting
- **Plan Enforcement**: Feature restrictions based on subscription tiers
- **Session Management**: Secure session tracking and analytics

### 🤖 Planned AI Features (Post-Launch)
- **Smart Text Processing**: AI-powered parsing of text files into structured project data
- **Template Generation**: AI-generated boilerplate code and project templates
- **Interactive Assistant**: "Clippy"-style AI helper for project management guidance
- **File Analysis**: AI-powered code review and improvement suggestions
- **Local AI Integration**: Support for local AI models (Ollama, LM Studio)
- **CLI/API Access**: Programmatic access to AI features via command line tools

## 🏗️ Architecture

### Frontend (`frontend/`)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + DaisyUI components (Retro theme)
- **API Layer**: Modular services with BaseApiService pattern
- **State Management**: Custom hooks for loading, errors, and resources
- **Routing**: React Router v6 with nested layouts
- **Real-time**: Activity tracking and collaboration indicators

### Backend (`backend/`)
- **Runtime**: Node.js + TypeScript + Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with JWT and Google OAuth
- **Payment**: Stripe integration for subscriptions
- **Email**: Nodemailer for notifications
- **Analytics**: Custom analytics tracking with activity logging
- **Real-time**: Session tracking and user activity monitoring

### Shared Type System (`shared/types/`)
- **Type Safety**: Complete type sharing between frontend/backend
- **Organization**: Types organized by feature (user, project, team, analytics)
- **Consistency**: Single source of truth for all interfaces

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database
- Stripe account (for billing features)
- Google OAuth credentials (optional)

### Development
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend `.env`:**
```env
DATABASE_URI=mongodb://localhost:27017/dev-codex
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=your-stripe-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5003
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 📁 Project Structure

```
project-manager/
├── shared/
│   └── types/              # Shared TypeScript interfaces
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── api/           # Modular API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level page components
│   │   ├── services/      # Business logic services
│   │   └── utils/         # Utility functions
└── backend/               # Node.js backend API
    ├── src/
    │   ├── config/        # Database and configuration
    │   ├── middleware/    # Express middleware
    │   ├── models/        # Mongoose data models
    │   ├── routes/        # API route handlers
    │   ├── scripts/       # Utility scripts
    │   ├── services/      # Business logic services
    │   └── utils/         # Helper utilities
```

## 🔧 Development Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm start` - Start production server

### Backend Scripts
- `npm run create-admin` - Create admin user
- `npm run setup-stripe` - Initialize Stripe integration
- `npm run debug-billing` - Debug billing issues
- `npm run cleanup` - Clean up database and optimize performance
- `npm run test:security` - Run security tests for import/export features

## 📋 Pre-Launch Status

### ✅ Completed Features
- Full MERN stack implementation with TypeScript
- Complete authentication system (JWT + Google OAuth)
- Project management with todos, notes, and deployment tracking
- Team collaboration with real-time features
- Stripe billing integration with subscription plans
- Admin dashboard and analytics
- Export/import functionality
- Public pages and discovery features

### 🔄 In Progress (Final Polish)
- UI consistency and hover state improvements
- Console.log cleanup (728 instances identified)
- Code consolidation for DRY principle adherence
- Performance optimization for production scaling
- Mobile responsiveness testing

### ⏳ Pre-Launch Priorities
1. **Performance Optimization**: Bundle size reduction and lazy loading
2. **Code Consolidation**: Eliminate duplicate theme utilities and API patterns  
3. **Production Readiness**: Environment variable setup and deployment configuration
4. **Testing**: Comprehensive testing across device sizes
5. **AI Integration Planning**: Detailed implementation roadmap for post-launch features

### 🎯 Launch Readiness: ~90%

## 📊 Performance Metrics

### Bundle Size (Production Build)
- **Total Compressed Size**: ~200KB gzipped
- **Main Application**: 102KB (22KB gzipped) 
- **Vendor Libraries**: 142KB (45KB gzipped)  
- **Stylesheets**: 194KB (30KB gzipped)
- **All 32 DaisyUI Themes**: Included for maximum user customization
- **Code Splitting**: Optimized with separate chunks for analytics, routing, and API services

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server  
- **Tailwind CSS** - Utility-first CSS
- **DaisyUI** - Component library
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **JWT** - Token-based authentication

### DevOps & Tools
- **Concurrently** - Run multiple processes
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Type checking