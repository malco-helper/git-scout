# Changelog

All notable changes to Git Scout will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2025-10-01

### Added

- **🎯 GitHub Actions Integration**: Complete GitHub Action for automated repository analytics
  - Slack webhook integration for weekly/scheduled reports
  - Auto-creates `git-scout.config.json` in workspace
  - Formatted Slack messages with Block Kit
  - Scheduled analytics with configurable cron
  - Support for custom channels, usernames, and report titles
- **📊 Slack Reporting**: Beautiful formatted reports sent directly to Slack channels
  - Key metrics: commits, files changed, contributors, lines added/deleted
  - Top contributors section with commit counts
  - Links to GitHub Actions workflow run
- **📦 Public npm Registry**: Published to npmjs.org for easier access
- **📖 Comprehensive Documentation**:
  - Complete USAGE guide for GitHub Actions
  - Updated README with Slack integration examples
  - Updated ROADMAP with completed features

### Fixed

- **🐛 JSON Output Corruption**: Fixed info messages appearing in JSON mode
  - Added `jsonMode` parameter to `detectCurrentRepository()`
  - Prevents console.log output when `--json` flag is used
- **🔧 Config Validation**: Properly handles missing configuration files
  - Validates config immediately after `getInstance()` call
  - Sets `configManager` to `null` if config doesn't exist
  - Allows graceful fallback to current directory detection
- **⚡ Interactive Prompts**: Fixed prompts appearing in non-interactive environments
  - Treats `--json` flag as non-interactive mode
  - Prevents exit code 130 (interrupted process) in CI/CD
  - Auto-selects first project in non-interactive mode
- **🔍 Error Visibility**: Improved error handling in GitHub Actions
  - Separated stderr from stdout for better error visibility
  - Added comprehensive troubleshooting tips
  - Shows partial output when available
  - Clear error messages with actionable solutions

### Changed

- **🚀 Non-Interactive Detection**: Enhanced to include JSON mode
  - `const isNonInteractive = !process.stdin.isTTY || options.json === true`
  - Ensures reliable CI/CD compatibility
- **📝 Field Paths**: Updated Slack payload parsing
  - Changed from `.totalCommits` to `.summary.totalCommits`
  - Changed from `.activeAuthors` to `.summary.uniqueAuthors`
  - Changed from `.name` to `.author` in authorStats
- **🔐 Package Publishing**: Removed GitHub Packages registry configuration
  - Now publishes to public npm for easier installation
  - Added `.npmrc` to `.gitignore` for security

### GitHub Action Features

- ✅ Zero configuration setup (auto-creates config)
- ✅ Works with any Git repository
- ✅ Configurable Slack integration
- ✅ Scheduled or on-demand execution
- ✅ Comprehensive error handling
- ✅ Detailed logging and troubleshooting

### Technical Improvements

- **Config Management**: Automatic workspace configuration generation
- **Error Handling**: Comprehensive error capture and reporting
- **JSON Parsing**: Correct field path traversal for nested objects
- **CI/CD Compatibility**: Full support for GitHub Actions environment
- **Package Distribution**: Published to public npm registry

### Documentation

- Added complete GitHub Actions USAGE guide
- Updated README with Slack integration examples
- Updated ROADMAP marking Phase 1.1 as completed
- Added troubleshooting section for common issues
- Documented all configuration options

## [0.0.2] - 2025-10-01

### Fixed

- **🔧 CI/Non-Interactive Mode Support**: `stats` and `today` commands now work in non-interactive environments (GitHub Actions, CI pipelines)
- **📦 Auto-Repository Detection**: Commands automatically detect and use the current repository when no configuration exists
- **✅ Improved GitHub Actions Compatibility**: Properly handles missing TTY and configuration in CI environments

### Changed

- Commands now intelligently fallback to current directory when no git-scout configuration is found
- Interactive prompts are automatically skipped in non-interactive environments
- Better error messages guiding users to run `git-scout init` when appropriate

## [0.0.2] - 2025-09-30

### Added

- **🆕 Automatic Repository Discovery**: New `git-scout init` command for automatic Git repository detection and configuration
- **Smart Project Analysis**: Automatically extracts project descriptions from package.json and README files
- **Flexible Scanning**: Supports both auto-discovery and custom directory scanning
- **Interactive Setup**: User-friendly wizard for selecting repositories and configuration options
- **Multiple Storage Options**: Choose between global and local configuration storage

### Enhanced

- **Improved Setup Experience**: Updated setup script to use the new init command
- **Better Documentation**: Enhanced README with comprehensive installation and usage guide
- **Streamlined Workflow**: Reduced manual configuration requirements for new users

### Commands

- `git-scout init`: Auto-discover and configure Git repositories with interactive selection

## [0.0.1] - 2025-09-30

### Added

- **Multi-Repository Management**: Configure and manage multiple Git projects from a single configuration file
- **Interactive Project Selection**: Checkbox-style selection with automatic Git repository validation
- **Branch Explorer**: Browse branches with detailed commit information and activity metrics
- **Today's Activity Dashboard**: Real-time insights into daily development activity
- **Comprehensive Statistics**: Detailed reports with author and file-level analytics
- **Beautiful Terminal UI**: ASCII tables with color coding and intuitive formatting
- **Flexible Date Parsing**: Support for relative dates (7d, today, yesterday) and absolute dates
- **JSON Export**: All commands support JSON output for integration with other tools
- **macOS Optimization**: Built specifically for macOS with proper timezone handling

### Commands

- `git-scout projects`: List and select projects from configuration
- `git-scout branches`: Explore branches and view commit details
- `git-scout today`: Show today's development activity
- `git-scout stats`: Generate comprehensive statistics for any time period

### Features

- **Configuration Management**: Global (`~/.git-scout/config.json`) and local (`./git-scout.config.json`) config support
- **Advanced Git Integration**: Direct Git CLI execution with efficient parsing
- **Date Range Filtering**: Flexible time range selection with natural language support
- **Author and Branch Filtering**: Filter statistics by specific authors or branches
- **File Change Analysis**: Detailed line-by-line change tracking with additions/deletions
- **Interactive Prompts**: User-friendly selection menus with validation
- **Error Handling**: Comprehensive error messages with helpful suggestions
- **Performance Optimization**: Efficient handling of large repositories

### Technical Implementation

- **TypeScript**: Full TypeScript implementation with comprehensive type definitions
- **Commander.js**: Robust CLI framework with command parsing
- **Inquirer.js**: Interactive command-line interfaces
- **Chalk**: Terminal string styling with colors
- **CLI-Table3**: Beautiful ASCII table rendering
- **Zod**: Runtime type validation for configuration
- **Vitest**: Modern testing framework with comprehensive test coverage

### Development Tools

- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **TypeScript Compiler**: Strong typing and compilation
- **Vitest**: Unit testing with mocking capabilities
- **Setup Script**: Automated installation and configuration

### Documentation

- **Comprehensive README**: Detailed usage instructions and examples
- **API Documentation**: Full command reference with options
- **Configuration Guide**: Step-by-step setup instructions
- **Troubleshooting Guide**: Common issues and solutions
- **Development Guide**: Architecture overview and contribution guidelines

### Platform Support

- **macOS**: Primary target platform with optimized timezone handling
- **Node.js**: Requires Node.js >= 16.0.0
- **Git**: Compatible with all modern Git versions

### Performance

- **Streaming**: Efficient processing of large Git repositories
- **Caching**: Smart caching of Git command results
- **Memory Management**: Optimized memory usage for large datasets
- **Concurrent Operations**: Parallel processing where possible

### Security

- **Input Validation**: Comprehensive validation of all user inputs
- **Path Sanitization**: Safe handling of file system paths
- **Command Injection Protection**: Secure Git command execution
- **Configuration Validation**: Schema-based config file validation
