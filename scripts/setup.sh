#!/bin/bash

# Git Scout Setup Script
# This script helps set up Git Scout for first-time users

set -e

echo "🔍 Git Scout Setup"
echo "=================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 16.0.0"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install >= $REQUIRED_VERSION"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "   Visit: https://git-scm.com/"
    exit 1
fi

echo "✅ Git $(git --version | cut -d' ' -f3) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Build the project
echo ""
echo "🔨 Building project..."
npm run build

# Create global config directory
CONFIG_DIR="$HOME/.git-scout"
CONFIG_FILE="$CONFIG_DIR/config.json"

if [ ! -d "$CONFIG_DIR" ]; then
    echo ""
    echo "📁 Creating global config directory: $CONFIG_DIR"
    mkdir -p "$CONFIG_DIR"
fi

# Copy sample config if doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
    echo "📋 Creating sample configuration file: $CONFIG_FILE"
    cp git-scout.config.sample.json "$CONFIG_FILE"
    
    echo ""
    echo "⚠️  IMPORTANT: Please edit your configuration file:"
    echo "   $CONFIG_FILE"
    echo ""
    echo "   Update the project paths to point to your actual Git repositories."
    echo ""
else
    echo "✅ Configuration file already exists: $CONFIG_FILE"
fi

# Link for global usage
echo ""
echo "🔗 Linking for global usage..."
npm link

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit your config file: $CONFIG_FILE"
echo "   2. Add your Git repository paths"
echo "   3. Run: git-scout projects"
echo ""
echo "💡 Quick commands to try:"
echo "   git-scout projects         # Configure your repositories"
echo "   git-scout today           # See today's activity"
echo "   git-scout stats --since 7d # Weekly statistics"
echo ""
echo "📚 For more help: git-scout --help"
