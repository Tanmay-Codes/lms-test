# JamClef LMS - React Version

This is a React implementation of the JamClef Learning Management System, featuring the same UI and functionality as the Next.js version but built with React + Vite.

## Features

- **Modern UI**: Built with Tailwind CSS, Shadcn UI components, and Aceternity UI inspired effects
- **Theme Customization**: Dark/light mode and color theme options (Blue, Purple, Green, Orange)
- **Authentication**: Login, registration, and protected routes
- **Role-Based Access Control**: Different views and permissions for students, instructors, and admins
- **Responsive Design**: Works great on all device sizes

## Tech Stack

- React 
- Vite
- React Router DOM
- Redux Toolkit & React Redux
- Tailwind CSS
- Shadcn UI components (via Radix UI primitives)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jamclef-lms-react.git
   cd jamclef-lms-react
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## Project Structure

```
jamclef-lms-react/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/             # Shadcn UI components
│   ├── config/             # Configuration files
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Layout components
│   ├── lib/                # Utility functions & services
│   │   ├── contexts/       # React contexts
│   │   └── redux/          # Redux store, slices, etc.
│   ├── pages/              # Page components
│   ├── App.jsx             # Main app component with routes
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## Authentication & Authorization

The project includes a complete authentication system with:

- Login/Register functionality
- Protected routes based on authentication status
- Role-based access control (RBAC) for different user types (admin, instructor, student)

## License

This project is licensed under the MIT License.
