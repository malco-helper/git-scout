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

# Initialize configuration
echo ""
echo "🚀 Initializing Git Scout configuration..."
echo ""
echo "You can now run 'git-scout init' to automatically discover and configure your Git repositories."

# Link for global usage
echo ""
echo "🔗 Linking for global usage..."
npm link

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Run: git-scout init     # Auto-discover your Git repositories"
echo "   2. Or manually edit config if needed"
echo "   3. Start analyzing with: git-scout today"
echo ""
echo "💡 Quick commands to try:"
echo "   git-scout init            # Auto-setup repositories"
echo "   git-scout projects        # View configured repositories"
echo "   git-scout today           # See today's activity"
echo "   git-scout stats --since 7d # Weekly statistics"
echo ""
echo "📚 For more help: git-scout --help"
