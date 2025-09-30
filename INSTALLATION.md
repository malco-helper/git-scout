# Git Scout - Installation Guide

## 📋 Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **Git**: Any modern version
- **macOS**: Primary target platform (arm64 & x64)

## 🚀 Installation Methods

### Method 1: Quick Setup Script (Recommended)

```bash
# Clone the repository
git clone <your-repository-url>
cd git-scout

# Run the setup script
./scripts/setup.sh
```

The setup script will:

- ✅ Check system requirements
- 📦 Install dependencies
- 🔨 Build the project
- 🔗 Link for global usage
- 📁 Create config directory
- 📋 Set up sample configuration

### Method 2: Manual Installation

```bash
# Clone and enter directory
git clone <your-repository-url>
cd git-scout

# Install dependencies
npm install

# Build the project
npm run build

# Link for global usage
npm link

# Create config directory
mkdir -p ~/.git-scout

# Copy sample config
cp git-scout.config.sample.json ~/.git-scout/config.json
```

### Method 3: NPM Package (Future)

```bash
# When published to NPM
npm install -g git-scout
```

## ⚙️ Configuration

### Option 1: Automatic Setup (Recommended) 🆕

Use the new `init` command to automatically discover and configure your Git repositories:

```bash
git-scout init
```

**Features:**

- 🔍 **Auto-discovery**: Scans common development directories
- 📝 **Smart analysis**: Extracts project descriptions automatically
- ⚡ **One-click setup**: No manual configuration needed
- 🎯 **Selective**: Choose which repositories to track

**What it scans (safely):**

- `~/Projects`, `~/Development`, `~/Dev`, `~/Code`, `~/Workspace`
- `~/src`, `~/git`, `~/GitHub`, `~/gitlab`, `~/repos`, `~/work`
- `~/Documents/Projects`, `~/Documents/Dev`, `~/Documents/Code` (specific subdirs only)
- Current directory and custom directories with `--scan-path` option

**What it avoids:**

- Sensitive macOS directories (Photos, Music, Movies, etc.)
- System directories that trigger permission requests
- Cloud storage directories (Dropbox, Google Drive, etc.)

### Option 2: Manual Configuration

If you prefer manual setup or need custom configuration:

#### 1. Create Configuration File

Choose one location:

- **Global**: `~/.git-scout/config.json` (recommended)
- **Local**: `./git-scout.config.json` (per project)

#### 2. Edit Configuration

```json
{
  "projects": [
    {
      "name": "My iOS App",
      "path": "/Users/yourname/Dev/ios-app"
    },
    {
      "name": "Backend API",
      "path": "/Users/yourname/Dev/api-server"
    },
    {
      "name": "React Client",
      "path": "/Users/yourname/Dev/react-app"
    }
  ],
  "defaultSinceDays": 1
}
```

#### 3. Update Project Paths

- Replace `/Users/yourname/Dev/...` with your actual repository paths
- Ensure all paths point to valid Git repositories
- Add or remove projects as needed

## ✅ Verification

Test your installation:

```bash
# Check if git-scout is available globally
git-scout --version

# Initialize configuration (recommended first step)
git-scout init

# List configured projects
git-scout projects

# Test with sample data
git-scout stats --project "My iOS App" --since 7d --json
```

## 🔧 Development Setup

For contributing or local development:

```bash
# Clone repository
git clone <repository-url>
cd git-scout

# Install dependencies
npm install

# Run in development mode
npm run dev -- --help

# Run tests
npm test

# Build for production
npm run build

# Link local version
npm run link:local
```

## 📁 Directory Structure

After installation:

```
~/.git-scout/
├── config.json          # Your project configuration

/path/to/git-scout/
├── dist/                 # Compiled JavaScript
├── src/                  # TypeScript source
├── scripts/              # Setup and utility scripts
├── package.json          # Dependencies and scripts
└── README.md             # Documentation
```

## 🎯 Quick Start Commands

Once installed and configured:

```bash
# Interactive project selection
git-scout projects

# View today's activity
git-scout today

# Explore branches
git-scout branches

# Generate weekly statistics
git-scout stats --since 7d

# Get help
git-scout --help
```

## 🐛 Troubleshooting

### Command not found: git-scout

```bash
# Re-link the package
npm link

# Or check if npm global bin is in PATH
npm config get prefix
# Add <prefix>/bin to your PATH
```

### Config file not found

```bash
# Create config directory
mkdir -p ~/.git-scout

# Copy sample config
cp git-scout.config.sample.json ~/.git-scout/config.json

# Edit with your project paths
nano ~/.git-scout/config.json
```

### Project path is not a Git repository

- Ensure the path contains a `.git` directory
- Check read permissions on the directory
- Verify you can run `git status` in that directory

### Permission denied

```bash
# Make setup script executable
chmod +x scripts/setup.sh

# Check file permissions
ls -la ~/.git-scout/config.json
```

### Node.js version issues

```bash
# Check current version
node --version

# Update Node.js if needed (using nvm)
nvm install 18
nvm use 18
```

## 🔄 Updates

To update Git Scout:

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

## 🗑️ Uninstallation

```bash
# Unlink global command
npm unlink -g git-scout

# Remove config directory (optional)
rm -rf ~/.git-scout

# Remove source directory
rm -rf /path/to/git-scout
```

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [README.md](README.md) for usage examples
3. Check [CHANGELOG.md](CHANGELOG.md) for version-specific notes
4. Open an issue on the repository

---

**Enjoy analyzing your Git repositories with Git Scout! 🔍✨**
