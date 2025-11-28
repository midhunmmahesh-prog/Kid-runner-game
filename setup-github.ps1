#!/usr/bin/env powershell
# Super Mario Kids Game - GitHub Setup Script
# This script will push your game to GitHub and enable GitHub Pages

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

Write-Host "`nSuper Mario Kids - GitHub Setup Script" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "=========================================" -ForegroundColor Cyan

# Step 1: Get GitHub username
Write-Host "Step 1: Enter your GitHub username" -ForegroundColor $Yellow
$githubUsername = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "Error: GitHub username cannot be empty!" -ForegroundColor $Red
    exit 1
}

Write-Host "GitHub username: $githubUsername" -ForegroundColor $Green

# Step 2: Get repository name
Write-Host "Step 2: Repository name" -ForegroundColor $Yellow
$repoName = "kid-runner-game"
Write-Host "Repository name will be: $repoName" -ForegroundColor $Green

# Step 3: Confirm git configuration
Write-Host "Step 3: Git configuration" -ForegroundColor $Yellow
$gitName = git config user.name
$gitEmail = git config user.email

if ([string]::IsNullOrWhiteSpace($gitName)) {
    Write-Host "Setting git name..." -ForegroundColor $Yellow
    $gitName = Read-Host "Enter your name for git commits"
    git config user.name "$gitName"
}

if ([string]::IsNullOrWhiteSpace($gitEmail)) {
    Write-Host "Setting git email..." -ForegroundColor $Yellow
    $gitEmail = Read-Host "Enter your email for git commits"
    git config user.email "$gitEmail"
}

Write-Host "Git name: $gitName" -ForegroundColor $Green
Write-Host "Git email: $gitEmail" -ForegroundColor $Green

# Step 4: Rename branch to main
Write-Host "Step 4: Renaming branch to main..." -ForegroundColor $Yellow
git branch -M main
Write-Host "Branch renamed to main" -ForegroundColor $Green

# Step 5: Display GitHub URL
Write-Host "Step 5: Next, create repository on GitHub" -ForegroundColor $Yellow
$repoUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "Instructions:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/new"
Write-Host "2. Repository name: $repoName"
Write-Host "3. Description: A fun Mario-style platformer game for kids"
Write-Host "4. Choose PUBLIC"
Write-Host "5. Do NOT initialize with README, .gitignore, or license"
Write-Host "6. Click 'Create repository'"
Read-Host "Press Enter when done creating the repository on GitHub"

# Step 6: Add remote and push
Write-Host "Step 6: Adding remote and pushing to GitHub..." -ForegroundColor $Yellow

try {
    Write-Host "Adding remote origin..." -ForegroundColor $Yellow
    git remote remove origin 2>$null
    git remote add origin $repoUrl
    Write-Host "Remote added: $repoUrl" -ForegroundColor $Green
    
    Write-Host "Pushing to GitHub..." -ForegroundColor $Yellow
    git push -u origin main
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor $Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor $Red
    Write-Host "Make sure you've created the repository on GitHub at:" -ForegroundColor $Yellow
    Write-Host "https://github.com/$githubUsername/$repoName" -ForegroundColor $Yellow
    exit 1
}

# Step 7: Enable GitHub Pages
Write-Host "Step 7: Enable GitHub Pages" -ForegroundColor $Yellow
Write-Host "Manual Setup Required:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/$githubUsername/$repoName/settings/pages"
Write-Host "2. Under Source select:"
Write-Host "   - Branch: main"
Write-Host "   - Folder: / (root)"
Write-Host "3. Click Save"
Write-Host "4. Wait 1-2 minutes for deployment"
Read-Host "Press Enter when you have enabled GitHub Pages"

# Step 8: Success message
Write-Host "`nSUCCESS! Your game will soon be live at:" -ForegroundColor Green
Write-Host "https://$githubUsername.github.io/$repoName/" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Wait 1-2 minutes for GitHub Pages to deploy"
Write-Host "2. Visit the URL above to see your game live"
Write-Host "3. To make updates, use:"
Write-Host "   git add ."
Write-Host "   git commit -m 'message'"
Write-Host "   git push origin main"
Write-Host "Done" -ForegroundColor Green
