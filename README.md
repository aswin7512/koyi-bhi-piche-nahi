# Koyi Bhi Piche Nahi 🌟

> **Motto:** "Everyone Can Shine"

## 📖 About The Project

**Koyi Bhi Piche Nahi** is a web application prototype built to address a crucial gap in educational guidance. The core idea is to empower differently-abled students by providing them with specialized guidance on choosing career options that align with their strengths and capabilities.

This project aims to demonstrate that with the right support and direction, everyone has the potential to shine in their professional lives.

**Note:** This is currently a **prototype** deployed for demonstration purposes to showcase the concept and core functionality.

## ✨ Features (Prototype)

* **Career Path Discovery:** An interactive interface to help students explore potential career options.
* **Accessibility Focus:** Designed with the intent to be accessible and user-friendly for people with diverse abilities.
* **Resource Hub:** (Add specifics here if your app has them, e.g., *Links to vocational training centers or scholarship info*).

## 🛠️ Built With

* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) **React** - UI Library
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) **Vite** - Build Tool & Development Server
* **CSS/Tailwind** (Update this based on what you used for styling)

## 📂 Project Structure

Here is an overview of the file structure for the project:

```text
.
├── index.html                   # Entry HTML file
├── package.json                 # Project dependencies and scripts
├── public                       # Static assets (images, icons, favicons)
│   ├── cover.jpg
│   └── ...
├── src
│   ├── App.tsx                  # Main Application Component & Router configuration
│   ├── components               # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Navbar.tsx
│   ├── constants.ts             # Global constants (Game definitions, config)
│   ├── index.tsx                # Entry point for React application
│   ├── lib                      # Library configurations
│   │   └── supabaseClient.ts    # Supabase DB connection client
│   ├── types.ts                 # TypeScript type definitions (User interfaces, etc.)
│   └── views                    # Page components and Route views
│       ├── AdminDashboard.tsx   # Teacher/Admin dashboard view
│       ├── GameArea.tsx         # Game introduction wrapper
│       ├── GameList.tsx         # Grid view of available games
│       ├── GamePlay.tsx         # Active game session container
│       ├── GameResult.tsx       # Post-game scoring and feedback screen
│       ├── games                # Individual game logic components
│       │   ├── ColorSorter.tsx
│       │   ├── DesktopRanger.tsx
│       │   ├── GiftWrapper.tsx
│       │   ├── PatternWeaver.tsx
│       │   └── RecipeBuilder.tsx
│       ├── Login.tsx            # User authentication screen
│       ├── ParentDashboard.tsx  # Parent monitoring dashboard
│       ├── Performance.tsx      # Analytics, charts, and progress reports
│       ├── ProfileSettings.tsx  # User profile and settings management
│       ├── Register.tsx         # New user registration screen
│       ├── StudentDashboard.tsx # Main landing dashboard for students
│       └── Support.tsx          # Support and help documentation
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite build configuration
```

## 🚀 Getting Started

To get a local copy of this prototype up and running, follow these simple steps.

### Prerequisites

* Node.js (v14 or higher recommended)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/aswin7512/koyi-bhi-piche-nahi.git
    ```
2.  **Navigate to the project directory**
    ```bash
    cd koyi-bhi-piche-nahi
    ```
3.  **Install dependencies**
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

### **Find the Deployed app:** [click here](https://aswin7512.github.io/koyi-bhi-piche-nahi)