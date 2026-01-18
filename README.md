# Reminder Application 📝

A modern, task management application built with **Angular v21** and **Nx**, featuring a sleek UI powered by **Tailwind CSS v4** and **Spartan**.

## ✨ Key Features

- **Task Management**: Create, edit, delete, and organize tasks effortlessly.
- **Smart UX**: Intuitive interfaces with responsive design and accessibility first.
- **Modern Stack**: leveraging the latest features of Angular (Signals, Standalone) and Tailwind CSS (v4).
- **Modular Architecture**: Scalable Nx workspace following DDD-inspired library partitioning.
- **Accessible UI**: Built with [Spartan](https://www.spartan.ng/), providing accessible, unstyled components based on shadcn/ui.

## 🛠️ Tech Stack

- **Framework**: [Angular v21](https://angular.dev/)
- **Build System**: [Nx](https://nx.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Spartan (shadcn/ui)](https://www.spartan.ng/) & [Lucide Icons](https://lucide.dev/)
- **State Management**: Angular Signals
- **Testing**: [Jest](https://jestjs.io/) & [Testing Library](https://testing-library.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm or pnpm

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development Server

Start the development server:

```bash
npx nx serve reminder-client
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Build the project for production:

```bash
npx nx build reminder-client
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

Execute the unit tests via [Jest](https://jestjs.io):

```bash
npx nx test reminder-client
```

To run tests for all libraries:

```bash
npx nx run-many -t test
```

## 📂 Project Structure

This workspace follows a modular architecture using Nx libraries:

- **`apps/reminder-client`**: The main application entry point.
- **`libs/task`**: Domain-specific logic and features for Tasks.
  - **`feature-list`**: Task listing and management logic.
  - **`data-access`**: State management (Stores/Services) and data fetching.
  - **`ui`**: Domain-specific presentational components.
- **`libs/shared`**: Reusable utilities and primitives.
  - **`ui/*`**: Granular, reusable UI components (Buttons, Inputs, Dialogs, etc.).
  - **`models`**: Shared interfaces and types.
- **`libs/util`**: General purpose utilities.
  - **`persistence`**: Local storage and persistence logic.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the `package.json` file for details.
