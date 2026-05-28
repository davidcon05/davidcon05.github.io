# GitHub Pages Deployment Guide

**Goal:** Deploy portfolio to `https://davidcon05.github.io/portfolio`

**Current Location:** `~/davidcontreras/portfolio/`

---

## Step-by-Step Deployment

### Step 1: Initialize Git Repository

```bash
cd ~/davidcontreras/portfolio

# Initialize git (if not already done)
git init

# Check status
git status

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Portfolio ready for GitHub Pages"
```

---

### Step 2: Create GitHub Repository

**Option A: Via Web (Recommended)**

1. Go to https://github.com/new
2. **Repository name:** `portfolio`
3. **Description:** "Personal portfolio showcasing mobile quality engineering expertise"
4. **Visibility:** Public ✅ (so recruiters can see it)
5. **DO NOT** initialize with README, .gitignore, or license (you already have these)
6. Click **"Create repository"**

**Option B: Via GitHub CLI** (if you have `gh` installed)

```bash
gh repo create portfolio --public --source=. --remote=origin --description="Personal portfolio"
```

---

### Step 3: Push Code to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/davidcon05/portfolio.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 50, done.
Counting objects: 100% (50/50), done.
...
To https://github.com/davidcon05/portfolio.git
 * [new branch]      main -> main
```

---

### Step 4: Enable GitHub Pages

1. Go to your repository: https://github.com/davidcon05/portfolio
2. Click **"Settings"** (top right)
3. Click **"Pages"** (left sidebar under "Code and automation")
4. Under **"Build and deployment"**:
   - **Source:** GitHub Actions ✅ (NOT "Deploy from a branch")
5. Click **"Save"**

**Screenshot reference:**
```
Build and deployment
├── Source: [GitHub Actions ▼]  ← Select this
└── (Deploy from a branch - deprecated)
```

---

### Step 5: Trigger Deployment

The GitHub Actions workflow will run automatically on every push to `main`.

**First deployment:**
```bash
# Make a small change to trigger deployment
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

**Check deployment status:**
1. Go to https://github.com/davidcon05/portfolio/actions
2. You should see a workflow run "Deploy to GitHub Pages"
3. Click on it to see progress
4. Wait 2-3 minutes for build + deploy

**Expected stages:**
- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Install dependencies (`npm ci`)
- ✅ Build site (`npm run build`)
- ✅ Upload artifact
- ✅ Deploy to GitHub Pages

---

### Step 6: Visit Your Live Site

**Your site will be live at:**
```
https://davidcon05.github.io/portfolio
```

**Test checklist:**
- [ ] Homepage loads
- [ ] All navigation links work (About, Skills, Blog, Projects)
- [ ] Blog posts display correctly
- [ ] Resume downloads from `/portfolio/dcontreras-resume-2026.pdf`
- [ ] GitHub/LinkedIn links work
- [ ] Mobile responsive (test on phone)

---

## Configuration Explained

### What we changed:

**File: `astro.config.mjs`**
```javascript
export default defineConfig({
  site: 'https://davidcon05.github.io',  // Your GitHub Pages domain
  base: '/portfolio',                     // Repo name (subpath)
  vite: {
    plugins: [tailwindcss()]
  }
});
```

**Why:**
- `site`: Tells Astro your production domain
- `base`: Since you're using `username.github.io/portfolio` (not a custom domain), all URLs need `/portfolio` prefix
- Astro will automatically prepend `/portfolio` to all internal links

**File: `.github/workflows/deploy.yml`**
- Automated deployment on every push to `main`
- Builds the site with `npm run build`
- Deploys the `dist/` folder to GitHub Pages

---

## Future Updates (How to Update Your Site)

**Every time you make changes:**

```bash
cd ~/davidcontreras/portfolio

# Make your changes (edit files, add blog posts, etc.)

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add new blog post: Shift-Left with AI"

# Push to GitHub
git push origin main

# GitHub Actions automatically rebuilds and deploys!
# Visit https://github.com/davidcon05/portfolio/actions to watch progress
# Site updates in 2-3 minutes
```

---

## Troubleshooting

### Issue: Site shows 404

**Check:**
1. Is GitHub Pages enabled? (Settings → Pages → Source: GitHub Actions)
2. Did the workflow run successfully? (Actions tab - should be green ✅)
3. Are you visiting the correct URL? `https://davidcon05.github.io/portfolio` (with `/portfolio`)

**Fix:**
- Wait 5 minutes after first deployment
- Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

---

### Issue: Workflow fails with "npm ci" error

**Error message:**
```
npm error code ENOLOCK
npm error Could not read package-lock.json
```

**Fix:**
```bash
# Regenerate package-lock.json
cd ~/davidcontreras/portfolio
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Regenerate package-lock.json"
git push origin main
```

---

### Issue: Links broken (404 errors)

**Symptom:** Clicking "About" gives 404

**Cause:** Base path not configured correctly

**Check `astro.config.mjs` has:**
```javascript
base: '/portfolio',
```

**Rebuild:**
```bash
npm run build
git add .
git commit -m "Fix base path configuration"
git push origin main
```

---

### Issue: Resume doesn't download

**Check:**
1. Is file in `public/` folder? (should be `public/dcontreras-resume-2026.pdf`)
2. Is link correct in About page?

**Fix:**
```bash
ls -la ~/davidcontreras/portfolio/public/
# Should show: dcontreras-resume-2026.pdf

# If missing, add it:
cp ~/path/to/resume.pdf ~/davidcontreras/portfolio/public/dcontreras-resume-2026.pdf
git add public/dcontreras-resume-2026.pdf
git commit -m "Add resume PDF"
git push origin main
```

---

## Custom Domain (Optional - Later)

**If you want `davidcontreras.dev` instead of `davidcon05.github.io/portfolio`:**

1. **Buy domain** ($12/year): Namecheap, Google Domains, Cloudflare
2. **Update `astro.config.mjs`:**
   ```javascript
   site: 'https://davidcontreras.dev',
   base: '/',  // Remove /portfolio when using custom domain
   ```
3. **Configure DNS:**
   - Add CNAME record: `www` → `davidcon05.github.io`
   - Add A records for apex domain (GitHub provides IPs)
4. **Add custom domain in GitHub:**
   - Settings → Pages → Custom domain
   - Enter: `davidcontreras.dev`
   - Wait 24-48 hours for DNS propagation

**Cost:** $12-15/year
**Benefit:** Looks more professional, easier to remember
**Recommendation:** Start with free GitHub Pages URL, buy domain later if needed

---

## Next Steps After Deployment

1. **Share your site:**
   - [ ] Update resume with portfolio URL
   - [ ] Add to LinkedIn "Websites" section
   - [ ] Share on LinkedIn: "Excited to share my new portfolio!"

2. **Monitor traffic:**
   - [ ] Add Google Analytics (optional)
   - [ ] Check GitHub Pages insights (Settings → Pages → Insights)

3. **Keep building:**
   - [ ] Add blog post weekly (use your 60-post strategy)
   - [ ] Add project screenshots
   - [ ] Iterate on About page

---

## Quick Commands Reference

```bash
# Navigate to portfolio
cd ~/davidcontreras/portfolio

# Test locally before pushing
npm run dev          # Dev server at http://localhost:4321
npm run build        # Build for production
npm run preview      # Preview production build locally

# Deploy to GitHub Pages
git add .
git commit -m "Your commit message"
git push origin main
# Auto-deploys in 2-3 minutes!

# Check deployment status
# Visit: https://github.com/davidcon05/portfolio/actions

# Visit live site
# Visit: https://davidcon05.github.io/portfolio
```

---

## Success Checklist

Before launching, verify:

- [ ] Local build works (`npm run build && npm run preview`)
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled (Settings → Pages → Source: GitHub Actions)
- [ ] Workflow runs successfully (Actions tab shows ✅)
- [ ] Site accessible at `https://davidcon05.github.io/portfolio`
- [ ] All links work (test every page)
- [ ] Resume downloads correctly
- [ ] Mobile responsive (test on phone)
- [ ] Ready to share with recruiters!

---

**Created:** 2026-05-28
**Your deployment URL:** `https://davidcon05.github.io/portfolio`
**Deployment time:** ~5 minutes after first push
**Auto-deploy:** Every push to `main` branch

**Ready to deploy? Run the commands in Step 1! 🚀**
