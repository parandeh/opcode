# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**opcode** is a desktop application built with Tauri 2 that provides a GUI interface for Claude Code. It manages Claude Code sessions, creates custom AI agents, tracks usage analytics, and provides timeline/checkpoint management for coding sessions. The project combines a React/TypeScript frontend with a Rust backend.

## Architecture

### Core Components

- **Frontend**: React 18 + TypeScript + Vite 6 with Tailwind CSS v4 and shadcn/ui components
- **Backend**: Rust with Tauri 2, SQLite database, and async process management
- **Build System**: Bun package manager, Tauri CLI for desktop app compilation
- **Cross-platform**: Windows, macOS, and Linux support with platform-specific optimizations

### Key Modules (Rust)

- `commands/`: Tauri command handlers for frontend-backend communication
  - `agents.rs`: Custom AI agent management and execution
  - `claude.rs`: Claude Code integration and session management
  - `mcp.rs`: Model Context Protocol server management
  - `usage.rs`: Analytics and cost tracking
  - `storage.rs`: Database operations
- `checkpoint/`: Session timeline and versioning system
  - `manager.rs`: Checkpoint creation and restoration logic
  - `state.rs`: Global checkpoint state management
  - `storage.rs`: Persistent checkpoint storage
- `process/`: Background process management for agent execution

### Frontend Structure

- `src/components/`: UI components organized by feature
- `src/lib/`: API client and utilities
- `src/stores/`: Zustand state management (example implementations)

## Development Commands

### Frontend Development
```bash
# Install dependencies
bun install

# Start development server (frontend only)
bun run dev

# Type checking
bunx tsc --noEmit

# Build frontend for production
bun run build
```

### Full Application Development
```bash
# Start development with hot reload (frontend + backend)
bun run tauri dev

# Build desktop application
bun run tauri build

# Build DMG for macOS
bun run build:dmg

# Debug build (faster compilation)
bun run tauri build --debug

# Build without bundle for CI
bun run tauri build --no-bundle -d
```

### Backend Development
```bash
# Run Rust tests
cd src-tauri && cargo test

# Format Rust code
cd src-tauri && cargo fmt

# Lint Rust code
cd src-tauri && cargo clippy

# Check Rust code without building
cd src-tauri && cargo check

# Combined check (TypeScript + Rust)
bun run check
```

### Testing
```bash
# Run all Rust tests (comprehensive test suite with real Claude execution)
cd src-tauri && cargo test

# Run specific test modules
cd src-tauri && cargo test agents
cd src-tauri && cargo test checkpoints

# Run tests with output
cd src-tauri && cargo test -- --nocapture
```

## Key Development Concepts

### Agent System Architecture
The application supports custom AI agents with:
- **Agent Definition**: Name, icon, model selection (Opus/Sonnet/Haiku), system prompts
- **Process Isolation**: Agents execute in separate processes for stability
- **Permission Management**: Configurable file and network access controls
- **Execution Tracking**: Real-time monitoring and historical run data
- **Import/Export**: GitHub integration and local file-based agent sharing

### Checkpoint/Timeline System
Advanced session management with:
- **Branching Timelines**: Fork sessions from any checkpoint
- **File Snapshots**: Content-addressable storage for file versioning
- **Auto-checkpointing**: Smart detection of significant changes
- **Diff Visualization**: Compare changes between checkpoints
- **Restoration**: Rollback to any previous state

### Database Schema
SQLite database with key tables:
- `agents`: Agent configurations and metadata
- `agent_runs`: Execution history and performance metrics
- `checkpoints`: Timeline metadata and file references
- `sessions`: Claude Code session tracking
- `usage_logs`: Token usage and cost analytics

### Claude Code Integration
Direct integration with Claude CLI:
- **Session Management**: Create, resume, and track Claude Code sessions
- **Project Detection**: Auto-discover Claude projects in `~/.claude/projects/`
- **Settings Sync**: Manage Claude configuration through the GUI
- **MCP Support**: Configure Model Context Protocol servers

## Development Guidelines

### Code Style
- **Rust**: Follow standard conventions, use `cargo fmt` and `cargo clippy`
- **TypeScript**: Strict mode enabled, functional components with hooks
- **Database**: Use prepared statements, handle all Result types explicitly
- **Error Handling**: Comprehensive error propagation with anyhow in Rust

### Testing Standards
- All new functionality requires tests
- Test suite uses real Claude execution for end-to-end validation
- Platform-aware testing for cross-platform compatibility
- No ignored tests or TODOs in production code

### Security Practices
- Input validation for all frontend-backend communication
- Process isolation for agent execution
- No logging of sensitive data (API keys, tokens)
- Permission-based file and network access controls

### Performance Considerations
- Lazy loading for large component trees
- Background process management with cleanup
- Efficient database queries with proper indexing
- Content-addressable storage for file deduplication

## Build and Deployment

### Prerequisites
- **Rust**: 1.70.0 or later via rustup
- **Bun**: Latest version for package management
- **Claude Code CLI**: Required for Claude integration
- **Platform Dependencies**:
  - Linux: webkit2gtk, gtk3, libayatana-appindicator3 development packages
  - macOS: Xcode Command Line Tools
  - Windows: Microsoft C++ Build Tools, WebView2

### CI/CD Pipeline
The GitHub Actions workflow (`build-test.yml`) provides:
- Multi-platform builds (Linux x86_64/ARM64, Windows, macOS)
- Dependency caching for faster builds
- Automated testing on all platforms
- Build artifact generation for releases

### Production Builds
Release builds are optimized with:
- Strip symbols and LTO enabled
- Code splitting for frontend bundle optimization
- Universal binary support for macOS (Intel + Apple Silicon)
- Multiple installer formats (.deb, .AppImage, .dmg, .msi)

## Important File Locations

- `src-tauri/src/main.rs`: Application entry point and Tauri command registration
- `package.json`: Frontend dependencies and build scripts
- `src-tauri/Cargo.toml`: Rust dependencies and build configuration
- `vite.config.ts`: Frontend build configuration with code splitting
- `cc_agents/`: Pre-built agent library with import/export system
- `src-tauri/tests/`: Comprehensive test suite with real Claude execution