# Initial Setup Demo

## Terminal Output

```
🔍 Git Scout - Initial Setup
═══════════════════════════════════════════════════════════════════════════════

🎯 Welcome to Git Scout! Let's set up your multi-repository workspace.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🚀 Quick Setup Options                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. 🎯 Auto-Discovery (Recommended) - Automatically find repositories        │
│ 2. 🔧 Manual Configuration - Add repositories manually                     │
│ 3. 📁 Single Directory - Scan specific directory                           │
│ 4. 🔄 Import from existing config                                          │
└─────────────────────────────────────────────────────────────────────────────┘

? Choose setup method: (Use arrow keys)
❯ 🎯 Auto-Discovery (Recommended)
  🔧 Manual Configuration
  📁 Single Directory
  🔄 Import from existing config

═══════════════════════════════════════════════════════════════════════════════

🔍 Scanning for Git repositories...
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️  Safe Directory Scan                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ✅ ~/Projects/                                                               │
│ ✅ ~/Dev/                                                                   │
│ ✅ ~/Code/                                                                  │
│ ✅ ~/GitHub/                                                                │
│ ✅ ~/Documents/Projects/                                                     │
│ ❌ ~/Pictures/ (Skipped - Privacy protection)                               │
│ ❌ ~/Music/ (Skipped - Privacy protection)                                 │
│ ❌ ~/Movies/ (Skipped - Privacy protection)                                │
└─────────────────────────────────────────────────────────────────────────────┘

🎉 Found 8 Git repositories!

┌─────────────────────────────────────────────────────────────────────────────┐
│ 📁 DISCOVERED REPOSITORIES                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ✅ git-scout                    │ /Users/malco/Projects/git-scout           │
│ ✅ my-web-app                   │ /Users/malco/Dev/my-web-app              │
│ ✅ api-backend                  │ /Users/malco/Code/api-backend              │
│ ✅ mobile-app                   │ /Users/malco/GitHub/mobile-app             │
│ ✅ data-analysis                │ /Users/malco/Projects/data-analysis        │
│ ✅ blog-site                    │ /Users/malco/Dev/blog-site                 │
│ ✅ e-commerce                   │ /Users/malco/Code/e-commerce               │
│ ✅ portfolio                    │ /Users/malco/GitHub/portfolio               │
└─────────────────────────────────────────────────────────────────────────────┘

? Select repositories to track: (Press <space> to select, <a> to toggle all, <i> to invert)
❯ ◉ git-scout
  ◉ my-web-app
  ◉ api-backend
  ◉ mobile-app
  ◉ data-analysis
  ◉ blog-site
  ◉ e-commerce
  ◉ portfolio

═══════════════════════════════════════════════════════════════════════════════

🔍 Analyzing repository details...

┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 REPOSITORY ANALYSIS                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ git-scout        │ TypeScript CLI │ 45 commits │ 2 branches │ Active        │
│ my-web-app       │ React App      │ 123 commits│ 4 branches │ Active        │
│ api-backend      │ Node.js API    │ 67 commits │ 3 branches │ Active        │
│ mobile-app       │ React Native   │ 89 commits │ 5 branches │ Active        │
│ data-analysis    │ Python Scripts │ 34 commits │ 1 branch   │ Stale         │
│ blog-site        │ Next.js Site   │ 56 commits │ 2 branches │ Active        │
│ e-commerce       │ Vue.js App     │ 78 commits │ 3 branches │ Active        │
│ portfolio        │ Static Site    │ 23 commits │ 1 branch   │ Stale         │
└─────────────────────────────────────────────────────────────────────────────┘

⚙️ Configuration Settings

? Default time range for statistics: (Use arrow keys)
❯ 7 days
  30 days
  90 days
  Custom

? File change limit for analysis: (Use arrow keys)
❯ 50 files
  100 files
  200 files
  Unlimited

? Default branch for analysis: (Use arrow keys)
❯ main
  develop
  master
  All branches

? Timezone for date display: (Use arrow keys)
❯ Asia/Ho_Chi_Minh
  UTC
  America/New_York
  Europe/London

═══════════════════════════════════════════════════════════════════════════════

💾 Saving configuration...

┌─────────────────────────────────────────────────────────────────────────────┐
│ ✅ CONFIGURATION SAVED                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Config file: ~/.git-scout/config.json                                       │
│ Projects tracked: 8                                                         │
│ Default time range: 7 days                                                  │
│ File limit: 50 files                                                        │
│ Default branch: main                                                         │
│ Timezone: Asia/Ho_Chi_Minh                                                  │
└─────────────────────────────────────────────────────────────────────────────┘

🎉 Setup Complete! Git Scout is ready to use.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🚀 QUICK START COMMANDS                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ git-scout today          │ View today's activity across all projects        │
│ git-scout stats          │ Generate comprehensive statistics                │
│ git-scout branches       │ Explore branches interactively                  │
│ git-scout projects       │ List and manage your projects                   │
│ git-scout --help         │ Show all available commands                     │
└─────────────────────────────────────────────────────────────────────────────┘

✨ Pro Tips:
• Use `git-scout today` to see your daily development activity
• Try `git-scout stats --since 7d` for weekly insights
• Use `--json` flag to export data for other tools
• Run `git-scout init` again to add more repositories

═══════════════════════════════════════════════════════════════════════════════
```

## Features Highlighted

- **Interactive Setup**: Step-by-step guided configuration
- **Auto-Discovery**: Automatically finds Git repositories
- **Privacy Protection**: Skips sensitive directories
- **Repository Analysis**: Shows project types and activity
- **Flexible Configuration**: Customizable settings for time ranges, file limits
- **Quick Start Guide**: Immediate next steps after setup
- **Pro Tips**: Helpful usage suggestions
