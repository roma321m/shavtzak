# Shift Scheduler


[Live](https://roma321m.github.io/shavtzak/)

A modern, feature-rich shift scheduling application built with React and Vite. This application helps manage employee schedules, missions, and availability with an intuitive interface and powerful scheduling capabilities.

## Features

- **Mission Management**: Create, edit, and duplicate missions with customizable details
- **Employee Management**: Add and manage employees with role assignments
- **Availability Tracking**: Employees can set their availability for different time periods
- **Schedule Generation**: Automatically generate schedules with equitable workload distribution
- **Import/Export**: 
    - **Export Data**: Save your entire workspace (missions, employees, schedule) to a JSON file.
    - **Import Data**: Restore your workspace from a JSON file.
    - **Export Schedule**: Download the generated schedule as an Excel file.
- **Internationalization**: Full support for English and Hebrew (RTL).
- **Premium Dark Theme**: Modern Material 3-inspired design with a sleek dark interface.

## Usage Guide

### 1. Setup Data
- **Missions**: Go to the "Missions" tab to define your shifts. You can set start/end times, required roles, and colors.
- **Employees**: Go to the "Employees" tab to add your team members. Assign them roles (e.g., Manager, Driver) and tags.

### 2. Manage Availability
- **Availability**: Use the "Availability" tab (Calendar view) to see who is available.
- **Individual Availability**: In the "Employees" tab, click the calendar icon on an employee card to set their specific availability dates.

### 3. Generate Schedule
- Go to the "Schedule" tab.
- Select the date range (defaults to the current week).
- Click **Generate**. The algorithm will assign employees to missions based on their roles and availability, ensuring fair distribution.
- **View Modes**: Toggle between "View by Employee" and "View by Mission" to see the schedule from different perspectives.

### 4. Export & Share
- **Excel**: Click "Export" in the Schedule tab to download an .xlsx file.
- **Backup/Share**: Use the "Export Data" button in the top header to save your configuration. You can share this JSON file with others, who can then "Import Data" to view the same setup.

### Reference Data
A sample data file is included in this repository: [`reference_data.json`](./reference_data.json). You can download this file and import it into the app to see a demo configuration.

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
