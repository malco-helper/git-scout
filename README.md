# 🔍 Git Scout

[![npm version](https://img.shields.io/npm/v/git-scout.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/git-scout)
[![npm downloads](https://img.shields.io/npm/dm/git-scout.svg?style=flat-square&color=green)](https://www.npmjs.com/package/git-scout)
[![GitHub license](https://img.shields.io/github/license/malcohelper/git-scout.svg?style=flat-square&color=orange)](https://github.com/malcohelper/git-scout/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/malcohelper/git-scout.svg?style=flat-square&color=yellow)](https://github.com/malcohelper/git-scout/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/malcohelper/git-scout.svg?style=flat-square&color=red)](https://github.com/malcohelper/git-scout/issues)

**Beautiful Git analytics for developers** - Track your repositories, analyze activity, and automate reports to Slack.

## ⚡ Quick Start - Just 3 Steps!

```bash
# Step 1: Install
npm install -g git-scout

# Step 2: Configure (auto-discovers your repos)
git-scout init

# Step 3: Analyze!
git-scout today
```

**That's it!** You're now tracking your Git activity with beautiful analytics.

## 🎯 What Can You Do?

### Basic Commands (Start Here)

- `git-scout today` - See today's commits and changes
- `git-scout stats --since 7d` - Weekly team statistics
- `git-scout branches` - Explore your branches

### Advanced Features

- 📊 **Multi-Repository Management** - Track multiple projects
- 📈 **Custom Reports** - Filter by author, branch, date range
- 📤 **JSON Export** - Integrate with your tools
- 🤖 **CI/CD Integration** - Automated Slack reports via GitHub Actions

## ✨ Key Features

- ⚡ **Zero Config** - Auto-discovers repos with `git-scout init`
- 🎨 **Beautiful Output** - Color-coded tables and insights
- 📅 **Smart Dates** - Use "7d", "today", or "2025-09-01"
- 🛡️ **Privacy First** - Only scans project folders (no Photos/Music)
- 🍎 **macOS Native** - Optimized for Mac developers

## 📦 Installation

```bash
npm install -g git-scout
```

That's all! Now run `git-scout init` to get started.

<details>
<summary>📖 Alternative Installation Methods</summary>

**Using Yarn:**

```bash
yarn global add git-scout
```

**From Source (for contributors):**

```bash
git clone https://github.com/malcohelper/git-scout.git
cd git-scout
./scripts/setup.sh
```

</details>

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

Automate your repository analytics with our GitHub Action! Get weekly reports sent directly to Slack.

#### Quick Setup

```yaml
# .github/workflows/weekly-report.yml
name: Weekly Analytics Report
on:
  schedule:
    - cron: "0 9 * * MON" # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  weekly-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: malcohelper/git-scout/.github/actions/git-scout@main
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          slack-channel: "team-updates"
          slack-username: "Git Scout Bot"
          report-title: "Weekly Analytics Report"
```

#### Features

- 📤 **Slack Integration** - Automated reports sent directly to Slack channels
- 📊 **Detailed Metrics** - Commits, files changed, contributors, and line changes
- ⏰ **Scheduled Reports** - Weekly/monthly automated analytics
- 🎨 **Formatted Messages** - Beautiful Slack Block Kit formatting
- 🔧 **Zero Configuration** - Auto-creates config, works out of the box
- 🛡️ **Error Handling** - Clear troubleshooting tips when issues occur

#### Example Slack Report

Git Scout automatically posts formatted reports to your Slack channel:

```
📊 Weekly Analytics Report

Repository: your-org/your-repo
Date: 2025-10-01 09:00 UTC

━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Key Metrics

Commits          Files Changed
19               23

Contributors     Lines Changed
3                +473 / -300

━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Top Contributors

• Alice: 12 commits
• Bob: 5 commits
• Charlie: 2 commits
```

📖 **[View Full Documentation →](.github/actions/git-scout/README.md)**

---

## 🎯 Core Commands

### Essential Commands (Daily Use)

```bash
# Today's activity
git-scout today

# Weekly statistics
git-scout stats --since 7d

# Explore branches
git-scout branches
```

### Advanced Usage

<details>
<summary>📘 Complete Command Reference</summary>

**Init & Configuration:**

```bash
git-scout init                           # Auto-discover repos
git-scout init --scan-path ~/MyProjects # Custom scan path
git-scout projects                       # Manage projects
```

**Filtering & Analysis:**

```bash
git-scout today --author alice           # Filter by author
git-scout stats --since "2025-09-01"     # Custom date range
git-scout branches --project "My App"    # Specific project
```

**Export & Integration:**

```bash
git-scout stats --json                   # JSON output
git-scout today --json | jq              # Pipe to jq
```

**Date Formats:**

- Relative: `7d`, `30d`, `today`, `yesterday`
- Absolute: `2025-09-01`
- With time: `today 09:00`

</details>

## 🌟 What's Next?

### 🚀 Current: CLI Analytics (✅ Complete)

You're using it now! Beautiful terminal analytics with zero config.

### 🔄 Phase 1: CI/CD Integration (In Progress)

- ✅ **GitHub Actions** - Automated Slack reports (Available now!)
- 🔜 **GitLab CI/CD** - MR analytics and pipeline tracking
- 🔜 **Docker Image** - Universal CI/CD integration

### 📊 Phase 2-3: Advanced Features (Planned)

- **GitHub/GitLab API** - Organization-wide analytics
- **Web Dashboard** - Interactive visualizations
- **PR/Issue Analytics** - Track review cycles and resolution times
- **Predictive Analytics** - Forecast delivery times

📖 **[View Full Roadmap →](ROADMAP.md)**

## 🐛 Troubleshooting

<details>
<summary>Common Issues & Solutions</summary>

**Command not found:**

```bash
npm link  # Re-link the package
```

**No repositories found:**

```bash
git-scout init --scan-path ~/your-dev-folder
```

**Reset configuration:**

```bash
rm ~/.git-scout/config.json && git-scout init
```

**Uninstall:**

```bash
npm uninstall -g git-scout
rm -rf ~/.git-scout  # Remove config (optional)
```

</details>

## 🤝 Contributing

We welcome contributions! Check out:

- 📖 [Development Guide](ROADMAP.md)
- 🐛 [Issues](https://github.com/malcohelper/git-scout/issues)
- 💬 [Discussions](https://github.com/malcohelper/git-scout/discussions)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for developers who love beautiful, insightful Git analytics.**

**🚀 Get started now:** `npm install -g git-scout && git-scout init`
