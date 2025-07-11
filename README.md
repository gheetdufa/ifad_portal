# IFAD Portal - Developer Setup Guide

A React/TypeScript application for the University of Maryland's Intern For A Day program. This guide will help you set up the development environment and start contributing to the project.

## 🚀 Quick Start

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository

1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the command palette
3. Type "Git: Clone" and select it
4. Enter the repository URL: `https://github.com/gheetdufa/ifad_portal.git`
5. Choose a local directory to save the project
6. Click "Clone"

### Step 2: Open the Project in VS Code

1. In VS Code, go to `File > Open Folder`
2. Navigate to the cloned `ifad_portal` directory
3. Click "Select Folder"

### Step 3: Install Dependencies

1. Open the integrated terminal in VS Code:
   - Press `Ctrl+`` (backtick) or go to `Terminal > New Terminal`
2. Make sure you're in the project root directory
3. Run the following command:
   ```bash
   npm install
   ```

### Step 4: Start the Development Server

1. In the terminal, run:
   ```bash
   npm run dev
   ```
2. Wait for the server to start (you'll see "VITE ready" message)
3. The application will be available at `http://localhost:5173/`
4. Your browser should automatically open, or you can manually navigate to the URL

## 🛠️ Development Workflow

### Making Changes

1. **Find the file you want to edit:**
   - Use `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac) to quickly search for files
   - Or navigate through the file explorer on the left sidebar

2. **Common file locations:**
   - **Homepage**: `src/pages/HomePage.tsx`
   - **Host List**: `src/pages/PublicHostList.tsx`
   - **Login Page**: `src/pages/LoginPage.tsx`
   - **Components**: `src/components/`
   - **Styling**: `src/index.css`

3. **Edit the file:**
   - Make your changes in VS Code
   - Save the file (`Ctrl+S` or `Cmd+S`)
   - The development server will automatically reload with your changes

### Hot Reload

The development server includes hot reload, which means:
- Changes to your code will automatically appear in the browser
- You don't need to manually refresh the page
- The server will show compilation status in the terminal

### VS Code Extensions (Recommended)

Install these extensions for a better development experience:

1. **ES7+ React/Redux/React-Native snippets**
   - Provides helpful code snippets for React development

2. **Prettier - Code formatter**
   - Automatically formats your code

3. **ESLint**
   - Helps catch errors and enforce code style

4. **Tailwind CSS IntelliSense**
   - Provides autocomplete for Tailwind CSS classes

5. **TypeScript Importer**
   - Helps with TypeScript imports

To install extensions:
1. Press `Ctrl+Shift+X` to open the Extensions panel
2. Search for the extension name
3. Click "Install"

## 📁 Project Structure

```
ifad_portal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Header, Footer, etc.
│   │   └── ui/             # Basic UI components (Button, Card, etc.)
│   ├── pages/              # Main page components
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── host/           # Host-related pages
│   │   └── student/        # Student-related pages
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Images, logos, etc.
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling. Key features:

- **Utility-first CSS framework**
- **Responsive design** built-in
- **UMD brand colors** already configured

### UMD Color Palette

```css
/* Primary Colors */
umd-red: #E21833
umd-gold: #FFD200
umd-black: #000000

/* Secondary Colors */
umd-gray-50: #F9FAFB
umd-gray-700: #374151
```

### Adding Styles

1. **Using Tailwind classes** (recommended):
   ```jsx
   <div className="bg-umd-red text-white p-4 rounded-lg">
     Hello World
   </div>
   ```

2. **Custom CSS** (if needed):
   - Add styles to `src/index.css`
   - Or create component-specific CSS files

## 🔧 Available Scripts

Run these commands in the terminal:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🚀 Deployment

### Building for Production

1. Run the build command:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory

3. Deploy the contents of `dist/` to your hosting service

### GitHub Pages Deployment

The project is configured for GitHub Pages deployment:
- Builds automatically deploy to `https://gheetdufa.github.io/ifad_portal/`
- The `vite.config.ts` handles the correct base path for production

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   - The dev server will automatically try the next available port
   - Check the terminal output for the correct URL

2. **Dependencies not installing:**
   - Delete `node_modules/` and `package-lock.json`
   - Run `npm install` again

3. **TypeScript errors:**
   - Make sure you have the TypeScript extension installed
   - Check the Problems panel in VS Code for specific errors

4. **Hot reload not working:**
   - Check that the dev server is running
   - Try refreshing the browser manually
   - Check the terminal for any error messages

### Getting Help

- Check the terminal output for error messages
- Look at the browser's developer console (F12)
- Review the Vite documentation: https://vitejs.dev/
- Check the React documentation: https://react.dev/

## 📝 Code Style Guidelines

- Use TypeScript for all new files
- Follow the existing component structure
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic
- Use meaningful variable and function names

## 🤝 Contributing

1. Make your changes in a new branch
2. Test your changes thoroughly
3. Commit with descriptive messages
4. Push your changes and create a pull request

---

**Happy coding! 🎉**

For questions or issues, please check the troubleshooting section above or reach out to the development team. 