# GitHub Push - Step by Step Guide

Follow these exact steps to push your Enthara Assessment project to GitHub.

## Prerequisites
- Git installed on your computer
- GitHub account created
- Repository created at: https://github.com/dev-raman-k/entharaAssesment

## Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter
- Or use PowerShell

**Or use VS Code Terminal:**
- Open project in VS Code
- Press `Ctrl + ~` to open terminal

## Step 2: Navigate to Project Directory

```bash
cd Desktop\entharaAssesment
```

Or if you're already in the folder, use:
```bash
cd entharaAssesment
```

Verify you're in the right place:
```bash
dir
```

You should see:
```
backend
frontend
.gitignore
README.md
QUICK_START.md
DEPLOYMENT_GUIDE.md
```

## Step 3: Initialize Git Repository

```bash
git init
```

Output should be: "Initialized empty Git repository"

## Step 4: Configure Git (If First Time)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@github.com"
```

## Step 5: Add All Files to Git

```bash
git add .
```

To verify files are staged, run:
```bash
git status
```

You should see green "Changes to be committed:" with all files listed.

## Step 6: Create Initial Commit

```bash
git commit -m "Initial commit: MERN project management app with full stack implementation"
```

## Step 7: Add Remote Repository

```bash
git remote add origin https://github.com/dev-raman-k/entharaAssesment.git
```

To verify:
```bash
git remote -v
```

You should see:
```
origin  https://github.com/dev-raman-k/entharaAssesment.git (fetch)
origin  https://github.com/dev-raman-k/entharaAssesment.git (push)
```

## Step 8: Rename Branch to Main (if needed)

```bash
git branch -M main
```

## Step 9: Push to GitHub

```bash
git push -u origin main
```

You might be prompted for authentication. Use one of these methods:

### Option A: GitHub CLI (Easiest)
```bash
gh auth login
# Follow prompts
git push -u origin main
```

### Option B: Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when prompted

### Option C: SSH (Advanced)
1. Generate SSH key: `ssh-keygen -t rsa -b 4096 -C "your.email@github.com"`
2. Add to GitHub: Settings > SSH and GPG keys
3. Use SSH URL for remote

## Step 10: Verify on GitHub

1. Go to https://github.com/dev-raman-k/entharaAssesment
2. You should see:
   - All folders (backend, frontend)
   - All files (README.md, etc.)
   - `.gitignore` working properly (no `node_modules`, no `.env`)
3. Check "Commits" tab shows your commit

## 📋 Verification Checklist

- [ ] Repository shows on GitHub
- [ ] Files are visible in GitHub
- [ ] `.env` files NOT visible (should be in .gitignore)
- [ ] `node_modules` NOT visible (should be in .gitignore)
- [ ] `.git` folder created locally
- [ ] Commit history visible on GitHub
- [ ] Backend folder with all files
- [ ] Frontend folder with all files
- [ ] README.md, QUICK_START.md, DEPLOYMENT_GUIDE.md visible

## 🔄 Making Changes Later

After you make changes locally:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit changes
git commit -m "Describe what you changed"

# Push to GitHub
git push origin main
```

## 🚨 If You Make Mistakes

### Undo Last Commit (Not Pushed)
```bash
git reset HEAD~1
```

### Undo Last Commit (Already Pushed)
```bash
git revert HEAD
git push origin main
```

### Fix Wrong Remote URL
```bash
git remote set-url origin https://github.com/dev-raman-k/entharaAssesment.git
```

### Check Git History
```bash
git log --oneline
```

## 📊 Expected Repository Structure on GitHub

```
enthara-assessment/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── README.md
├── QUICK_START.md
└── DEPLOYMENT_GUIDE.md
```

## 🎯 Common Issues

### Issue: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/dev-raman-k/entharaAssesment.git
```

### Issue: "Permission denied (publickey)"
- Use HTTPS instead of SSH
- Or set up SSH keys properly

### Issue: "nothing to commit"
- Make sure you did `git add .` first
- Check `git status`

### Issue: ".env file committed by mistake"
```bash
git rm --cached .env
git commit -m "Remove .env file"
git push origin main
```

## ✅ After Successful Push

1. **GitHub Repository Link:**
   https://github.com/dev-raman-k/entharaAssesment

2. **Next Steps:**
   - Verify all files are on GitHub
   - Test cloning: `git clone https://github.com/dev-raman-k/entharaAssesment.git test-clone`
   - If it works, you're ready for deployment

3. **Ready for Deployment:**
   - Follow DEPLOYMENT_GUIDE.md
   - Deploy backend to Railway
   - Deploy frontend to Netlify

## 📞 Quick Command Reference

```bash
# Check status
git status

# View commit history
git log

# Add files
git add .

# Commit
git commit -m "message"

# Push
git push origin main

# Pull (get latest from GitHub)
git pull origin main

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout branch-name

# View all branches
git branch -a
```

## 🎉 Success!

Your project is now on GitHub! Next, follow **DEPLOYMENT_GUIDE.md** to:
1. Deploy backend on Railway
2. Deploy frontend on Netlify
3. Set up automatic deployments

---

**Questions?** Check GitHub documentation at https://docs.github.com
