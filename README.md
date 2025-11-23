# Shift Scheduler

A modern, feature-rich shift scheduling application built with React and Vite. This application helps manage employee schedules, missions, and availability with an intuitive interface and powerful scheduling capabilities.

## Features

- **Mission Management**: Create, edit, and duplicate missions with customizable details
- **Employee Management**: Add and manage employees with role assignments
- **Availability Tracking**: Employees can set their availability for different time periods
- **Schedule Generation**: Automatically generate schedules with equitable workload distribution
- **Export Functionality**: Export schedules to Excel format
- **Premium Dark Theme**: Modern Material 3-inspired design with a sleek dark interface
- **Responsive Design**: Works seamlessly across different screen sizes

## Prerequisites

Before running this application locally, make sure you have the following installed:

- **Node.js** (version 16 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd shift-scheduler
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the App Locally

### Development Mode

To run the application in development mode with hot module replacement (HMR):

```bash
npm run dev
```

The application will start and be available at `http://localhost:5173` (or another port if 5173 is already in use). The terminal will display the exact URL.

### Production Build

To create a production-optimized build:

```bash
npm run build
```

The built files will be output to the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Linting

To run ESLint and check for code quality issues:

```bash
npm run lint
```

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **date-fns** - Date manipulation library
- **Lucide React** - Icon library
- **XLSX** - Excel file generation
- **UUID** - Unique identifier generation

## Project Structure

```
shift-scheduler/
├── src/
│   ├── components/     # React components
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   └── main.jsx        # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Project dependencies and scripts
```

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
