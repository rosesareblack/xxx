# Tauri Desktop Application

This document covers the desktop application component of Strategic Code IDE, built with Tauri.

## Overview

The desktop application provides native performance while maintaining the flexibility of web technologies. It uses Tauri to create a lightweight, secure, and fast desktop experience.

## Architecture

```
src-tauri/
├── src/
│   ├── main.rs          # Application entry point
│   └── lib.rs           # Library functions
├── icons/               # Application icons
├── Cargo.toml          # Rust dependencies
├── tauri.conf.json     # Tauri configuration
└── build.rs            # Build script
```

## Features

### Native Performance
- Rust backend for high-performance operations
- Direct file system access
- System-level integrations
- Minimal memory footprint

### Security
- Sandboxed execution environment
- Controlled API access
- Secure inter-process communication
- Permission-based system access

### Cross-Platform Support
- Windows (x64, ARM64)
- macOS (Intel, Apple Silicon)
- Linux (x64, ARM64)

## Development

### Prerequisites
- Rust 1.70.0 or higher
- Platform-specific dependencies:
  - **Windows**: Microsoft C++ Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: webkit2gtk, AppIndicator

### Setup
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Tauri CLI
cargo install tauri-cli

# Or use npm version
npm install -g @tauri-apps/cli
```

### Development Commands
```bash
# Start development mode
npm run dev-tauri

# Build for development
cargo build --manifest-path=src-tauri/Cargo.toml

# Build for release
npm run build-tauri

# Run tests
cargo test --manifest-path=src-tauri/Cargo.toml
```

## Configuration

### tauri.conf.json
The main configuration file controls:
- Application metadata
- Window properties
- Security settings
- Build configuration
- API allowlist

### Key Configuration Sections

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:3000",
    "distDir": "../out"
  },
  "package": {
    "productName": "Strategic Code IDE",
    "version": "0.1.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "scope": ["$APPDATA/strategic-code/*"]
      }
    }
  }
}
```

## Rust Backend

### main.rs Functions

#### File Operations
```rust
#[tauri::command]
fn save_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(path, content)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path)
        .map_err(|e| e.to_string())
}
```

#### System Integration
- File system access
- Process management
- System notifications
- Clipboard operations

### Adding New Commands

1. **Define the command in Rust**
```rust
#[tauri::command]
fn my_custom_command(input: String) -> String {
    format!("Processed: {}", input)
}
```

2. **Register in main function**
```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![my_custom_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

3. **Call from frontend**
```typescript
import { invoke } from '@tauri-apps/api/tauri';

const result = await invoke('my_custom_command', { input: 'test' });
```

## Frontend Integration

### Tauri API Usage
```typescript
import { invoke } from '@tauri-apps/api/tauri';
import { save, open } from '@tauri-apps/api/dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';

// Save file with dialog
const saveFile = async (content: string) => {
  const filePath = await save();
  if (filePath) {
    await writeTextFile(filePath, content);
  }
};

// Open file with dialog
const openFile = async () => {
  const filePath = await open();
  if (filePath && typeof filePath === 'string') {
    const content = await readTextFile(filePath);
    return content;
  }
};
```

### Window Management
```typescript
import { appWindow } from '@tauri-apps/api/window';

// Minimize window
await appWindow.minimize();

// Toggle fullscreen
await appWindow.setFullscreen(true);

// Set window title
await appWindow.setTitle('My Custom Title');
```

## Building & Distribution

### Development Build
```bash
npm run dev-tauri
```

### Release Build
```bash
npm run build-tauri
```

### Platform-Specific Builds
```bash
# Windows
cargo tauri build --target x86_64-pc-windows-msvc

# macOS
cargo tauri build --target x86_64-apple-darwin
cargo tauri build --target aarch64-apple-darwin

# Linux
cargo tauri build --target x86_64-unknown-linux-gnu
```

### Code Signing

#### macOS
```bash
# Set up signing identity
export APPLE_CERTIFICATE="Developer ID Application: Your Name"
export APPLE_CERTIFICATE_PASSWORD="password"

# Build with signing
npm run build-tauri
```

#### Windows
```bash
# Set up certificate
export WINDOWS_CERTIFICATE="path/to/certificate.p12"
export WINDOWS_CERTIFICATE_PASSWORD="password"

# Build with signing
npm run build-tauri
```

## Updater

### Configuration
```json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.myapp.com/{{target}}/{{current_version}}"
      ],
      "dialog": true,
      "pubkey": "your-public-key"
    }
  }
}
```

### Implementation
```typescript
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';

const update = await checkUpdate();
if (update.shouldUpdate) {
  await installUpdate();
}
```

## Performance Optimization

### Bundle Size
- Use conditional compilation for platform features
- Minimize dependencies
- Enable LTO (Link Time Optimization)

### Memory Usage
- Implement proper resource cleanup
- Use efficient data structures
- Monitor memory leaks

### Startup Time
- Lazy load heavy operations
- Optimize initialization code
- Use async operations where possible

## Security Best Practices

### API Allowlist
Only enable required APIs:
```json
{
  "allowlist": {
    "all": false,
    "fs": {
      "scope": ["$APPDATA/myapp/*"]
    },
    "shell": {
      "open": true
    }
  }
}
```

### Content Security Policy
```json
{
  "security": {
    "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'"
  }
}
```

## Troubleshooting

### Common Issues

**Rust compilation errors**
- Update Rust toolchain: `rustup update`
- Clear build cache: `cargo clean`

**WebKit errors on Linux**
```bash
sudo apt install webkit2gtk-4.0-dev
```

**Code signing issues**
- Verify certificate validity
- Check signing permissions
- Review keychain access

### Debug Mode
```bash
# Enable debug logging
RUST_LOG=debug npm run dev-tauri

# Or for specific modules
RUST_LOG=tauri=debug npm run dev-tauri
```

## Resources

- Tauri Documentation
- Rust Book
- Tauri API Reference
- Platform Setup Guides