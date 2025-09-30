# 🔍 Git Scout

A powerful CLI tool for managing and analyzing multiple Git repositories with advanced statistics and beautiful visualizations.

## ✨ Key Features

- 🆕 **Auto-Discovery**: Automatically find and configure Git repositories with `git-scout init`
- 📊 **Multi-Repository Management**: Track multiple Git projects from a single interface
- 🌿 **Interactive Branch Explorer**: Browse branches with detailed commit information
- 📈 **Today's Activity Dashboard**: Get instant insights into daily development activity
- 📋 **Comprehensive Statistics**: Generate detailed reports with author and file-level analytics
- 🎨 **Beautiful Tables & Colors**: ASCII tables with syntax highlighting and intuitive color coding
- 📅 **Flexible Date Parsing**: Support for relative dates (7d, today, yesterday) and absolute dates
- 📤 **JSON Export**: All commands support JSON output for integration with other tools
- 🍎 **macOS Optimized**: Built specifically for macOS with proper timezone handling and safe scanning
- 🛡️ **Privacy-Focused**: Avoids sensitive directories (Photos, Music, etc.) - no permission requests

## ⚡ Quick Start (30 seconds)

```bash
# 1. Install globally
npm install -g git-scout

# 2. Auto-configure your repositories
git-scout init

# 3. Start analyzing!
git-scout today
```

## 🚀 Installation & Setup

### Step 1: Install Git Scout

**🎯 Recommended: Install from NPM (Easiest)**

```bash
# Install globally with npm
npm install -g git-scout

# Or install globally with yarn
yarn global add git-scout
```

**🔧 Development: Clone from GitHub**

```bash
# Clone the repository
git clone https://github.com/malco-helper/git-scout.git
cd git-scout

# Auto-install everything
./scripts/setup.sh
```

**Or manual installation:**

```bash
npm install && npm run build && npm link
```

### Step 2: Auto-Configure Your Repositories 🆕

```bash
# 🎯 ONE COMMAND TO RULE THEM ALL
git-scout init
```

**What this does:**

- 🔍 Automatically scans for Git repositories in safe directories
- 📝 Extracts project descriptions from package.json/README files
- ⚡ Creates configuration instantly - no manual setup needed
- 🛡️ Respects macOS privacy - no permission requests for Photos/Music/etc.

### Step 3: Start Analyzing!

```bash
# View today's activity
git-scout today

# Explore branches
git-scout branches

# Generate weekly statistics
git-scout stats --since 7d
```

## 📸 Demo Gallery

See Git Scout in action with these beautiful terminal interfaces:

### 🎯 Today's Activity Dashboard

```
🔍 Git Scout - Today's Activity
📊 PROJECT: git-scout | 📅 Date: September 30, 2025
┌─────────────────────────────────────────────────────────────────────────────┐
│ Today's Activity Summary                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Total Commits: 8 | Files Changed: 23 | Lines Added: +487 | Removed: -123  │
└─────────────────────────────────────────────────────────────────────────────┘
👥 AUTHORS                    │ COMMITS │ FILES │ +LINES │ -LINES │
├─────────────────────────────┼────────┼───────┼────────┼────────┤
│ malco-helper               │ 5       │ 15    │ +312   │ -89    │
│ John Doe                   │ 2       │ 6     │ +125   │ -23    │
└─────────────────────────────┴────────┴───────┴────────┴────────┘
```

[View Full Demo →](docs/demo/today-activity.md)

### 🌿 Interactive Branch Explorer

```
🔍 Git Scout - Branch Explorer
🌿 BRANCHES OVERVIEW
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🌟 main (current) - 45 commits ahead                                        │
│ 🔥 develop - 12 commits ahead, 3 commits behind                            │
│ 🚀 feature/auth - 8 commits ahead, 1 commit behind                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

[View Full Demo →](docs/demo/branches-explorer.md)

### 📊 Comprehensive Analytics

```
🔍 Git Scout - Comprehensive Statistics
📅 PERIOD: Last 30 days | Total Commits: 156 | Net Change: +3,333 lines
👥 AUTHOR STATISTICS
├─────────────────────────┬─────────┬───────┬────────┬────────┬─────────────┤
│ malco-helper            │ 89      │ 156   │ +2,845 │ -678   │ 🚀 High     │
│ John Doe                │ 34      │ 45    │ +987   │ -234   │ 📈 Medium   │
└─────────────────────────┴─────────┴───────┴────────┴────────┴─────────────┘
```

[View Full Demo →](docs/demo/stats-analytics.md)

### ⚙️ Interactive Setup Wizard

```
🔍 Git Scout - Initial Setup
🎯 Welcome to Git Scout! Let's set up your multi-repository workspace.
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🚀 Quick Setup Options                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. 🎯 Auto-Discovery (Recommended) - Automatically find repositories        │
│ 2. 🔧 Manual Configuration - Add repositories manually                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

[View Full Demo →](docs/demo/init-setup.md)

## 🔄 CI/CD Integration

### GitHub Actions

Automate your repository analytics with our GitHub Action! Get instant insights on every PR.

#### Quick Setup

```yaml
# .github/workflows/pr-analytics.yml
name: PR Analytics
on: [pull_request]

permissions:
  pull-requests: write

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          post-comment: true
          quality-gate: true
```

#### Features

- 🤖 **Automated PR Comments** - Post analytics directly to pull requests
- ✅ **Quality Gates** - Block PRs that don't meet standards
- 📊 **JSON Export** - Integrate with external systems
- ⏰ **Scheduled Reports** - Weekly/monthly automated reports
- 🎯 **Smart Token Management** - Auto-injection with clear validation

#### Example Output

When a PR is opened, Git Scout automatically posts:

```markdown
## 🔍 Git Scout Analysis

**Quality Score**: 85/100 ✅

### 📊 Repository Statistics
| Metric | Value |
|--------|-------|
| Total Commits | 45 |
| Files Changed | 23 |
| Lines Added | +1,234 |
| Active Authors | 5 |

### 👥 Top Contributors
- Alice: 20 commits, 15 files
- Bob: 15 commits, 10 files
```

📖 **[View Full Documentation →](.github/actions/git-scout/README.md)**

---

## 🎯 Core Commands

### `git-scout init` - Auto Setup 🆕

**The easiest way to get started!**

```bash
git-scout init                           # Auto-discover repositories
git-scout init --scan-path ~/MyProjects # Scan specific directory
git-scout init --global                 # Force global configuration
```

**Safe Scanning:**

- ✅ Scans: `~/Projects`, `~/Dev`, `~/Code`, `~/GitHub`, `~/Documents/Projects`
- ❌ Avoids: Photos, Music, Movies, System directories (no permission requests!)

### `git-scout today` - Daily Activity

```bash
git-scout today                          # Today's activity
git-scout today --author alice           # Filter by author
git-scout today --branch main            # Filter by branch
```

### `git-scout stats` - Comprehensive Analytics

```bash
git-scout stats --since 7d               # Weekly statistics
git-scout stats --since "2025-09-01"     # Since specific date
git-scout stats --author alice --json    # JSON output for specific author
```

### `git-scout branches` - Branch Explorer

```bash
git-scout branches                       # Interactive branch explorer
git-scout branches --project "My App"    # Specific project
git-scout branches --since 30d          # Show recent activity
```

### `git-scout projects` - Project Management

```bash
git-scout projects                       # List and select projects
git-scout projects --json               # JSON output
```

## 📊 Sample Output

### Author Statistics

```
┌─────────────────────────┬─────────┬───────┬────────┬────────┐
│ AUTHOR                  │ COMMITS │ FILES │ +LINES │ -LINES │
├─────────────────────────┼─────────┼───────┼────────┼────────┤
│ John Doe                │ 15      │ 23    │ +487   │ -123   │
│ Jane Smith              │ 8       │ 12    │ +234   │ -67    │
└─────────────────────────┴─────────┴───────┴────────┴────────┘
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

## 📅 Flexible Date Formats

Git Scout supports natural date expressions:

- **Relative**: `today`, `yesterday`, `7d`, `30d`
- **Specific**: `today 09:00`, `2025-09-29`
- **ISO Format**: `2025-09-29T10:00:00`

## ⚙️ Configuration

### Automatic (Recommended)

```bash
git-scout init  # One command setup!
```

### Manual Configuration

Create `~/.git-scout/config.json`:

```json
{
  "projects": [
    {
      "name": "My App",
      "path": "/Users/yourname/Dev/my-app"
    }
  ],
  "defaultSinceDays": 1
}
```

## 🔧 Advanced Usage

### JSON Integration

```bash
# Export data for other tools
git-scout stats --since 7d --json > weekly-report.json
git-scout today --json | jq '.stats.totalCommits'
```

### Filtering & Analysis

```bash
# Team productivity analysis
git-scout stats --since 30d --author "team@company.com"

# Branch comparison
git-scout branches --project "Backend" --since 7d

# File change tracking
git-scout stats --since 7d --limit 50
```

### Multiple Projects Workflow

```bash
# 1. Configure multiple projects
git-scout init

# 2. Select projects interactively
git-scout projects

# 3. Analyze across selected projects
git-scout today
```

## 🐛 Troubleshooting

### Command not found

```bash
npm link  # Re-link the package
```

### No repositories found

```bash
git-scout init --scan-path ~/your-dev-folder  # Custom scan path
```

### Permission issues

```bash
chmod +x scripts/setup.sh  # Make setup script executable
```

### Config issues

```bash
rm ~/.git-scout/config.json && git-scout init  # Reset and reconfigure
```

## 🗑️ Uninstallation

**If installed via NPM/Yarn:**

```bash
# Remove global command (npm)
npm uninstall -g git-scout

# Remove global command (yarn)
yarn global remove git-scout
```

**If installed from source:**

```bash
# Remove global command
npm unlink -g git-scout

# Remove source code
rm -rf /path/to/git-scout
```

**Remove configuration (optional):**

```bash
# Remove configuration files
rm -rf ~/.git-scout
```

## 🧪 Development & Testing

### Prerequisites

- Node.js >= 16.0.0
- Git
- macOS (primary target)

### Development Setup

```bash
git clone <repository-url>
cd git-scout
npm install
npm run dev -- --help    # Development mode
npm test                 # Run tests
npm run build            # Production build
```

### Architecture

```
src/
├── commands/           # CLI commands (init, projects, branches, today, stats)
├── git/               # Git integration and parsing
├── ui/                # Table rendering and formatting
├── utils/             # Date parsing and utilities
├── config.ts          # Configuration management
├── types.ts           # TypeScript definitions
└── index.ts           # Main CLI entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🌟 Roadmap

See our detailed [ROADMAP.md](ROADMAP.md) for the complete development plan.

### Highlights:

#### 🔥 Phase 1: CI/CD Integration (Priority)
- [ ] **GitHub Actions Integration** - Automated PR analytics and quality gates
- [ ] **GitLab CI/CD Integration** - MR comments and pipeline analytics
- [ ] **Jenkins Plugin** - Legacy CI/CD support
- [ ] **Docker Image** - Universal CI/CD integration

#### 🌐 Phase 2-3: API Integration
- [ ] **GitHub API Integration** - Organization-wide analytics, PR/Issue tracking, Security alerts
- [ ] **GitLab API Integration** - Group-wide analytics, MR/Issue tracking, Pipeline analytics

#### 📊 Phase 4-6: Advanced Features
- [ ] **Commit Message Analysis** - Pattern detection and quality scoring
- [ ] **Team Productivity Metrics** - Cross-team comparison and trends
- [ ] **Web Dashboard** - Interactive analytics and visualization
- [ ] **CSV/Excel Export** - Data export and custom integrations
- [ ] **Real-time Monitoring** - Live activity tracking
- [ ] **Custom Report Templates** - Configurable report generation

**📖 [View Full Roadmap →](ROADMAP.md)**

## 📝 License

MIT License - see LICENSE file for details.

---

## 💡 Pro Tips

1. **Start with `git-scout init`** - it's the fastest way to get up and running
2. **Use `--json` flag** for integrating with other tools and scripts
3. **Combine filters** for precise analysis: `--author alice --branch main --since 7d`
4. **Regular analysis** helps track team productivity and code quality trends
5. **Safe scanning** means no macOS permission popups - scan worry-free!

---

**Made with ❤️ for developers who love beautiful, insightful Git analytics.**

**🚀 Get started in 30 seconds: `git-scout init`**
