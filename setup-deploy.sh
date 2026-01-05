#!/bin/bash

# FIFA Prediction App - Deployment Setup Script

echo "🚀 FIFA Prediction App - Render Deployment Setup"
echo "================================================"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git is installed"

# Check if Git LFS is installed
if ! command -v git-lfs &> /dev/null; then
    echo "⚠️  Git LFS is not installed."
    echo "Installing Git LFS..."
    
    # Try to install Git LFS based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install git-lfs
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install git-lfs
    else
        echo "Please install Git LFS manually: https://git-lfs.github.com/"
        exit 1
    fi
fi

echo "✅ Git LFS is installed"

# Initialize Git LFS
echo ""
echo "📦 Initializing Git LFS..."
git lfs install

# Initialize Git repository if not already
if [ ! -d ".git" ]; then
    echo ""
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check model file sizes
echo ""
echo "📊 Checking model file sizes..."
find backend/models -type f \( -name "*.pkl" -o -name "*.npy" -o -name "*.csv" \) -exec ls -lh {} \;

# Add and commit files
echo ""
echo "📝 Adding files to Git..."
git add .

echo ""
echo "💾 Creating initial commit..."
git commit -m "Initial commit: FIFA prediction app with LFS models"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin <your-github-repo-url>"
echo "3. Run: git push -u origin main"
echo "4. Go to Render Dashboard and connect your repository"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
