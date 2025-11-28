# 📖 Steps to Push to GitHub and Enable GitHub Pages

Your game repository is ready locally! Follow these steps to complete the GitHub setup:

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and log in
2. Click the **+** icon in the top right and select **New repository**
3. Name your repository: `kid-runner-game`
4. Add description: "A fun Mario-style platformer game for kids"
5. Choose **Public** (required for GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

## Step 2: Add Remote and Push to GitHub

After creating the repository, GitHub will show commands. Copy your repository URL (it looks like `https://github.com/YOUR-USERNAME/kid-runner-game.git`) and run:

```bash
cd "d:\kid runner game"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/kid-runner-game.git
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub: `github.com/YOUR-USERNAME/kid-runner-game`
2. Click **Settings** (gear icon)
3. Scroll down to **Pages** section on the left sidebar
4. Under "Source", select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**

## Step 4: Your Game is Live! 🎉

GitHub Pages will automatically deploy your game. Within a minute, it will be available at:

```
https://YOUR-USERNAME.github.io/kid-runner-game/
```

**Note:** It may take 1-2 minutes for the deployment to complete.

## Verify Your Game

Visit the URL above in your browser. You should see your Super Mario Kids game running!

## Update the README

Edit your `README.md` on GitHub and update the line:
```
Play the game here: [Super Mario Kids on GitHub Pages](https://yourusername.github.io/kid-runner-game)
```

Replace `yourusername` with your actual GitHub username.

## Making Future Updates

To update your game in the future:

```bash
cd "d:\kid runner game"
# Make your changes to the files
git add .
git commit -m "Your commit message"
git push origin main
```

Your GitHub Pages will automatically update within seconds!

---

**Congratulations!** Your game is now on GitHub and accessible to everyone online! 🚀🍄⭐
