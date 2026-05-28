# 🚀 Deploy Your Portfolio RIGHT NOW

**Location:** `~/davidcontreras/portfolio/`

**Your site will be:** `https://davidcon05.github.io/portfolio`

---

## Copy-Paste These Commands (5 Minutes)

### Step 1: Test Build Locally (1 minute)

```bash
cd ~/davidcontreras/portfolio
npm run build
```

**Expected:** Build completes without errors ✅

---

### Step 2: Create GitHub Repo (2 minutes)

**Go to:** https://github.com/new

**Fill in:**
- Repository name: `portfolio`
- Description: "Personal portfolio showcasing mobile quality engineering expertise"
- Public ✅
- **DO NOT** check "Add a README" (you already have one)

**Click:** "Create repository"

---

### Step 3: Push Code to GitHub (1 minute)

```bash
cd ~/davidcontreras/portfolio

# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio ready for GitHub Pages"

# Connect to GitHub (use YOUR username)
git remote add origin https://github.com/davidcon05/portfolio.git

# Push
git push -u origin main
```

**Expected:**
```
✅ Enumerating objects...
✅ Counting objects...
✅ Writing objects...
✅ To https://github.com/davidcon05/portfolio.git
   * [new branch]      main -> main
```

---

### Step 4: Enable GitHub Pages (1 minute)

1. Go to: https://github.com/davidcon05/portfolio/settings/pages
2. Under **"Build and deployment"**:
   - **Source:** Select **"GitHub Actions"** from dropdown
3. (No need to click Save - it auto-saves)

**Screenshot:**
```
┌─────────────────────────────────────┐
│ Source: [GitHub Actions ▼]  ← Click here and select this
└─────────────────────────────────────┘
```

---

### Step 5: Watch It Deploy (2-3 minutes)

1. Go to: https://github.com/davidcon05/portfolio/actions
2. You'll see "Deploy to GitHub Pages" running 🟡
3. Wait for it to turn green ✅
4. Click "deploy" job to watch progress

**Stages you'll see:**
```
build
  ✅ Checkout
  ✅ Setup Node
  ✅ Install dependencies
  ✅ Build with Astro
  ✅ Upload artifact

deploy
  ✅ Deploy to GitHub Pages
```

---

### Step 6: Visit Your Live Site! 🎉

**Open in browser:**
```
https://davidcon05.github.io/portfolio
```

**Test:**
- [ ] Homepage loads ✅
- [ ] Click "About" ✅
- [ ] Click "Skills" ✅
- [ ] Click "Blog" ✅
- [ ] Click "Projects" ✅
- [ ] Download resume ✅
- [ ] GitHub link works ✅
- [ ] LinkedIn link works ✅

**Test on mobile:**
- [ ] Open on your phone ✅
- [ ] Hamburger menu works ✅

---

## If Something Goes Wrong

### Build Fails

**Error:** `npm error code ENOLOCK`

**Fix:**
```bash
cd ~/davidcontreras/portfolio
npm install  # Regenerates package-lock.json
git add package-lock.json
git commit -m "Add package-lock.json"
git push origin main
```

---

### GitHub Pages Not Enabled

**Symptom:** No "Deploy to GitHub Pages" workflow runs

**Fix:**
1. Go to: https://github.com/davidcon05/portfolio/settings/pages
2. Source: Select "GitHub Actions"
3. Wait 1 minute, refresh Actions page

---

### Site Shows 404

**Wait 5 minutes** after first deployment, then:
- Hard refresh browser (Cmd+Shift+R)
- Check workflow succeeded (should be green ✅)
- Verify URL: `https://davidcon05.github.io/portfolio` (with `/portfolio`)

---

## After Deployment

### Immediately:

```bash
# Update your resume with portfolio link
# Add to LinkedIn "Websites" section
# Share on LinkedIn!
```

**LinkedIn post:**
> "Excited to share my new portfolio showcasing mobile quality engineering and AI-assisted development! Check it out: https://davidcon05.github.io/portfolio"

---

### This Week:

- [ ] Add portfolio URL to resume
- [ ] Update LinkedIn profile
- [ ] Share with 3 trusted friends for feedback
- [ ] Start writing next blog post ("Shift-Left with AI")

---

### Every Time You Update:

```bash
cd ~/davidcontreras/portfolio

# Make changes (add blog post, update content, etc.)

# Commit and push
git add .
git commit -m "Add new blog post"
git push origin main

# Auto-deploys in 2-3 minutes!
# Check progress: https://github.com/davidcon05/portfolio/actions
```

---

## The Fastest Path (3 Commands)

**If you just want it live ASAP:**

```bash
# 1. Commit everything
cd ~/davidcontreras/portfolio
git add .
git commit -m "Portfolio v1.0 - ready for deployment"

# 2. Push to GitHub (after creating repo on GitHub.com)
git remote add origin https://github.com/davidcon05/portfolio.git
git push -u origin main

# 3. Enable GitHub Pages (via web):
# https://github.com/davidcon05/portfolio/settings/pages
# Source: GitHub Actions

# Done! Live in 3 minutes at:
# https://davidcon05.github.io/portfolio
```

---

## What You've Built

✅ **Responsive portfolio** (mobile + desktop)
✅ **Blog system** (2 posts published, ready for more)
✅ **Projects showcase** (FieldNote, BooksSquad, enterprise work)
✅ **About page** (your story, philosophy, contact info)
✅ **Resume download** (PDF ready for recruiters)
✅ **Auto-deployment** (push to main = auto-deploy)
✅ **Free hosting** (GitHub Pages, no cost)

---

## Your Portfolio Stack

- **Framework:** Astro 6.3.7 (fast, modern, SEO-friendly)
- **Styling:** Tailwind CSS v4 (Material Design 3 tokens)
- **Hosting:** GitHub Pages (free, fast, reliable)
- **Deployment:** GitHub Actions (automated on every push)
- **Blog:** Markdown-based content collections
- **Cost:** $0/month (FREE!)

---

## Next Steps

**Right now:**
1. Run Step 1 commands (test build)
2. Create GitHub repo (Step 2)
3. Push code (Step 3)
4. Enable Pages (Step 4)
5. Watch it deploy (Step 5)
6. Visit your live site (Step 6)
7. Celebrate! 🎉

**This weekend:**
- Share on LinkedIn
- Update resume
- Get feedback from friends

**Next week:**
- Write "Shift-Left with AI" blog post
- Add project screenshots
- Keep iterating

---

**You're 5 minutes away from a live portfolio. Let's do this! 🚀**

---

**Need help?** Check `GITHUB_PAGES_DEPLOYMENT.md` for detailed troubleshooting.

**Already deployed?** Check `blog-planning/` for your 60-post content strategy.
