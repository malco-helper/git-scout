# 🔍 Git Scout

A powerful CLI tool for managing and analyzing multiple Git repositories with advanced statistics and beautiful visualizations.

## ✨ Features

- **Multi-Repository Management**: Configure and manage multiple Git projects from a single interface
- **Interactive Branch Explorer**: Browse branches with detailed commit information and activity metrics
- **Today's Activity Dashboard**: Get instant insights into today's development activity
- **Comprehensive Statistics**: Generate detailed reports with author and file-level analytics
- **Beautiful Tables & Colors**: ASCII tables with syntax highlighting and intuitive color coding
- **Flexible Date Parsing**: Support for relative dates (7d, today, yesterday) and absolute dates
- **JSON Export**: All commands support JSON output for integration with other tools
- **macOS Optimized**: Built specifically for macOS with proper timezone handling

## 🚀 Installation

### Global Installation (Recommended)

```bash
npm install -g git-scout
```

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd git-scout

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
npm run link:local

# Or run directly with ts-node
npm run dev -- --help
```

## 📋 Configuration

Git Scout requires a configuration file to define your Git projects. Create one of these files:

- **Global**: `~/.git-scout/config.json`
- **Local**: `./git-scout.config.json` (in your current directory)

### Sample Configuration

```json
{
  "projects": [
    {
      "name": "App iOS",
      "path": "/Users/yourname/Dev/app-ios"
    },
    {
      "name": "Backend API",
      "path": "/Users/yourname/Dev/backend-api"
    },
    {
      "name": "RN Client",
      "path": "/Users/yourname/Dev/rn-client"
    }
  ],
  "defaultSinceDays": 1
}
```

### Configuration Options

- `projects`: Array of project objects with `name` and `path`
- `defaultSinceDays`: Default number of days to look back for statistics (default: 1)

## 🎯 Usage

### Quick Start

```bash
# 1. Set up your projects
git-scout projects

# 2. View today's activity
git-scout today

# 3. Explore branches
git-scout branches

# 4. Generate comprehensive stats
git-scout stats --since 7d
```

### Commands

#### `git-scout projects`

List and select projects from your configuration. Validates that all paths are valid Git repositories.

```bash
git-scout projects [--json]
```

**Options:**

- `--json`: Output results in JSON format

#### `git-scout branches`

Explore branches and view detailed commit information.

```bash
git-scout branches [options]
```

**Options:**

- `-p, --project <name>`: Specific project to analyze
- `-r, --remote`: Include remote branches
- `-s, --since <date>`: Show commits since date
- `--json`: Output results in JSON format

**Examples:**

```bash
git-scout branches --project "Backend API"
git-scout branches --since 7d --json
```

#### `git-scout today`

Show today's development activity with detailed statistics.

```bash
git-scout today [options]
```

**Options:**

- `-p, --project <name>`: Project to analyze
- `-s, --since <date>`: Start date (default: today)
- `-u, --until <date>`: End date (default: end of today)
- `-a, --author <email|name>`: Filter by author
- `-b, --branch <name>`: Filter by branch
- `-l, --limit <number>`: Limit number of files shown
- `--json`: Output results in JSON format

**Examples:**

```bash
git-scout today --project "RN Client"
git-scout today --author "alice@company.com"
git-scout today --branch develop --limit 10
```

#### `git-scout stats`

Generate comprehensive statistics for any time period.

```bash
git-scout stats [options]
```

**Options:**

- `-p, --project <name>`: Project to analyze
- `-s, --since <date>`: Start date (e.g., 7d, today, 2025-09-01)
- `-u, --until <date>`: End date (default: now)
- `-a, --author <email|name>`: Filter by author
- `-b, --branch <name>`: Filter by branch
- `-l, --limit <number>`: Limit number of files shown
- `--json`: Output results in JSON format

**Examples:**

```bash
git-scout stats --since 7d
git-scout stats --since "2025-09-01" --until "2025-09-30"
git-scout stats --author "alice@company.com" --json
git-scout stats --branch main --limit 50
```

### Date Formats

Git Scout supports flexible date parsing:

- **Relative**: `today`, `yesterday`, `7d`, `30d`
- **Specific Time**: `today 09:00`, `yesterday 18:30`
- **Absolute**: `2025-09-29`, `2025-09-29T10:00:00`
- **ISO Strings**: Full ISO 8601 format

## 📊 Output Examples

### Author Statistics Table

```
┌─────────────────────────┬─────────┬───────┬────────┬────────┐
│ AUTHOR                  │ COMMITS │ FILES │ +LINES │ -LINES │
├─────────────────────────┼─────────┼───────┼────────┼────────┤
│ John Doe                │ 15      │ 23    │ +487   │ -123   │
│ Jane Smith              │ 8       │ 12    │ +234   │ -67    │
│ Bob Wilson              │ 5       │ 8     │ +156   │ -45    │
└─────────────────────────┴─────────┴───────┴────────┴────────┘
```

### File Statistics Table

```
┌──────────────────────────────────────────────────┬─────────┬────────┬────────┐
│ FILE                                             │ COMMITS │ +LINES │ -LINES │
├──────────────────────────────────────────────────┼─────────┼────────┼────────┤
│ src/api/user.controller.ts                       │ 8       │ +180   │ -45    │
│ ios/AppDelegate.m                                │ 3       │ +90    │ -10    │
│ src/components/UserProfile.tsx                   │ 5       │ +67    │ -23    │
└──────────────────────────────────────────────────┴─────────┴────────┴────────┘
```

### Branch Information

```
🌿 Branch: develop

Latest commit: a1b2c3d
Author: John Doe
Date: 09/30/2025 14:30
Message: Add user authentication feature
Recent commits: 12
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test -- --coverage
```

### Test Structure

- `src/utils/__tests__/`: Date parsing utilities tests
- `src/git/__tests__/`: Git service and parsing tests
- Unit tests for core functionality with mocked Git commands

## 🔧 Development

### Prerequisites

- Node.js >= 16.0.0
- Git (for analyzing repositories)
- TypeScript
- macOS (primary target platform)

### Development Workflow

```bash
# Install dependencies
npm install

# Start development with auto-reload
npm run dev -- projects

# Build for production
npm run build

# Lint code
npm run lint

# Clean build artifacts
npm run clean
```

### Architecture

```
src/
├── commands/           # CLI command implementations
│   ├── projects.ts     # Project management
│   ├── branches.ts     # Branch exploration
│   ├── today.ts        # Today's activity
│   └── stats.ts        # Comprehensive statistics
├── git/                # Git integration
│   └── gitService.ts   # Git command execution and parsing
├── ui/                 # User interface utilities
│   └── table.ts        # Table rendering and formatting
├── utils/              # Utility functions
│   └── date.ts         # Date parsing and formatting
├── config.ts           # Configuration management
├── types.ts            # TypeScript type definitions
└── index.ts            # Main CLI entry point
```

## 🎨 Features in Detail

### Interactive Project Selection

- Checkbox-style multi-project selection
- Automatic Git repository validation
- Path verification and error reporting

### Advanced Date Parsing

- Natural language dates (today, yesterday)
- Relative periods (7d, 30d)
- Specific timestamps with timezone support
- Range validation and error handling

### Comprehensive Git Integration

- Direct Git CLI execution for maximum compatibility
- Efficient parsing of git log, numstat, and branch data
- Support for large repositories with streaming
- Proper handling of merge commits and complex histories

### Beautiful Terminal UI

- Color-coded output with semantic meaning
- ASCII tables with proper alignment
- Progress indicators and loading states
- Error messages with helpful suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Config file not found**

```bash
# Create global config directory
mkdir -p ~/.git-scout
# Copy sample config and edit
cp git-scout.config.sample.json ~/.git-scout/config.json
```

**Project path is not a Git repository**

- Ensure the path points to a directory containing a `.git` folder
- Verify you have read access to the directory

**No commits found**

- Check if the date range includes any commits
- Verify branch names and author filters
- Try expanding the time range with `--since 30d`

**Permission denied errors**

- Ensure Git is installed and accessible in PATH
- Check repository permissions
- Verify you can run `git status` in the project directory

### Debug Mode

For detailed debugging information:

```bash
# Enable verbose Git output
export GIT_SCOUT_DEBUG=1
git-scout stats --since 7d
```

## 🌟 Roadmap

- [ ] Support for GitLab/GitHub API integration
- [ ] Commit message analysis and categorization
- [ ] Team productivity metrics and insights
- [ ] Export to CSV/Excel formats
- [ ] Web dashboard for multi-project overview
- [ ] Integration with popular project management tools
- [ ] Custom report templates
- [ ] Real-time repository monitoring

---

**Made with ❤️ for developers who love beautiful, insightful Git analytics.**
