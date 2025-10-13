# Quick Start Guide

Get up and running with Strategic Code IDE in under 5 minutes!

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/strategic-code-ide.git
cd strategic-code-ide
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Using the Strategic Code Interface

### 1. Navigate to Strategic Code
- Open your browser to `http://localhost:3000`
- Navigate to `/strategic-code` route
- You'll see the main interface with four AI-powered tools

### 2. Try the AI Tools

#### Intelligent Assistant
- Enter a coding question or paste code for analysis
- Get AI-powered suggestions and optimizations
- Review security and performance recommendations

#### Rapid Coder
- Select your preferred framework (React, Vue, Angular)
- Describe the component you want to create
- Generate boilerplate code instantly

#### Code Generator
- Choose your programming language
- Select design patterns and architecture types
- Generate custom code solutions

#### Repository Manager
- View your GitHub repository status
- Monitor branches, commits, and pull requests
- Manage collaborative development workflow

## Desktop App (Optional)

### 1. Install Tauri CLI
```bash
npm install -g @tauri-apps/cli
```

### 2. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 3. Run Desktop App
```bash
npm run dev-tauri
```

## Key Features to Explore

### 🧠 AI-Powered Analysis
- Paste any code snippet into the Intelligent Assistant
- Get instant feedback on code quality, security, and performance
- Receive optimization suggestions

### ⚡ Rapid Development
- Use the Rapid Coder for quick component generation
- Select from popular frameworks and libraries
- Generate production-ready boilerplate

### 🔧 Advanced Generation
- Try the Code Generator for complex algorithms
- Implement design patterns with one click
- Generate architecture-specific solutions

### 📁 GitHub Integration
- Connect your repositories
- Visualize branch structures
- Track development progress

## Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
GITHUB_TOKEN=your_github_token_here
```

### Customization
- Modify `tailwind.config.ts` for styling
- Update `components.json` for UI components
- Configure `next.config.js` for build settings

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run dev-tauri` | Start desktop app |
| `npm run build-tauri` | Build desktop app |

## Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
npx kill-port 3000
# or
npm run dev -- --port 3001
```

**Module not found errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tauri build errors**
```bash
rustup update
cargo clean --manifest-path=src-tauri/Cargo.toml
```

### Getting Help

- Check the Development Workflow Guide
- Review the full documentation
- Open an issue on GitHub
- Join our community Discord

## Next Steps

1. **Explore the Code**: Browse the `components/` directory to understand the architecture
2. **Customize**: Modify components to fit your specific needs
3. **Integrate**: Connect with your preferred AI models and APIs
4. **Deploy**: Follow our deployment guide for production setup
5. **Contribute**: Help improve the project by submitting pull requests

## Pro Tips

- Use `Ctrl/Cmd + K` for quick navigation
- Bookmark frequently used tools
- Explore keyboard shortcuts for efficiency
- Check the browser console for detailed logs
- Use the desktop app for better performance

Happy coding! 🚀