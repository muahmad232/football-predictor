# FIFA Prediction App - Deployment Setup Script (PowerShell)

Write-Host "FIFA Prediction App - Render Deployment Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
}
catch {
    Write-Host "Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if Git LFS is installed
try {
    $lfsVersion = git lfs version
    Write-Host "Git LFS is installed: $lfsVersion" -ForegroundColor Green
}
catch {
    Write-Host "Git LFS is not installed." -ForegroundColor Yellow
    Write-Host "Installing Git LFS..." -ForegroundColor Yellow
    
    # Check if Chocolatey is installed
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install git-lfs -y
    }
    else {
        Write-Host "Please install Git LFS manually:" -ForegroundColor Yellow
        Write-Host "1. Download from: https://git-lfs.github.com/" -ForegroundColor Yellow
        Write-Host "2. Or use Chocolatey: choco install git-lfs" -ForegroundColor Yellow
        exit 1
    }
}

# Initialize Git LFS
Write-Host ""
Write-Host "📦 Initializing Git LFS..." -ForegroundColor Cyan
git lfs install

# Initialize Git repository if not already
if (-not (Test-Path ".git")) {
    Write-Host ""
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "Git repository initialized" -ForegroundColor Green
}
else {
    Write-Host "Git repository already exists" -ForegroundColor Green
}

# Check model file sizes
Write-Host ""
Write-Host "Checking model file sizes..." -ForegroundColor Cyan
Get-ChildItem -Path "backend\models" -Include *.pkl,*.npy,*.csv -Recurse | ForEach-Object {
    $size = [math]::Round($_.Length / 1MB, 2)
    Write-Host "$($_.Name): $size MB" -ForegroundColor Yellow
}

# Calculate total size
$totalSize = (Get-ChildItem -Path "backend\models" -Include *.pkl,*.npy,*.csv -Recurse | Measure-Object -Property Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "Total model size: $totalSizeMB MB" -ForegroundColor Yellow

if ($totalSizeMB -gt 1000) {
    Write-Host "Warning: Models exceed 1GB. GitHub LFS free tier limit is 1GB." -ForegroundColor Yellow
    Write-Host "Consider using Method 2 from DEPLOYMENT.md (Manual upload)" -ForegroundColor Yellow
}

# Check if .env files exist
Write-Host ""
Write-Host "Checking environment files..." -ForegroundColor Cyan

if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend\.env from template..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
}

if (-not (Test-Path "frontend\.env")) {
    Write-Host "Creating frontend\.env from template..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env"
}

Write-Host "Environment files ready" -ForegroundColor Green

# Add and commit files
Write-Host ""
Write-Host "Adding files to Git..." -ForegroundColor Cyan
git add .

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: FIFA prediction app with LFS models"

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Add remote and push:" -ForegroundColor White
Write-Host "   git remote add origin <your-github-repo-url>" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy on Render:" -ForegroundColor White
Write-Host "   - Go to: https://dashboard.render.com" -ForegroundColor Gray
Write-Host "   - Click 'New +' → 'Blueprint'" -ForegroundColor Gray
Write-Host "   - Connect your GitHub repository" -ForegroundColor Gray
Write-Host "   - Render will detect render.yaml and deploy automatically" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to check Git LFS tracking
Write-Host "Would you like to verify Git LFS is tracking your model files? (Y/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "Git LFS tracked files:" -ForegroundColor Cyan
    git lfs ls-files
}
