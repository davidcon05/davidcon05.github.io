# Portfolio Deployment Checklist

**Goal:** Get portfolio live at a public URL this week

**Current Status:** Site is built, running locally, needs content + deployment

---

## Phase 1: Pre-Deployment (Before Going Live)

### Critical (Must Do Before Launch)

- [ ] **Test local build**
  ```bash
  cd ~/Desktop/portfolio
  npm run build
  npm run preview
  # Visit http://localhost:4321 and test all pages
  ```

- [ ] **Verify all links work**
  - [ ] GitHub link (https://github.com/davidcon05)
  - [ ] LinkedIn link (https://www.linkedin.com/in/dbcontreras/)
  - [ ] Email link (david.b.contreras@gmail.com)
  - [ ] Resume download (/dcontreras-resume-2026.pdf)
  - [ ] All internal navigation (About, Skills, Blog, Projects)

- [ ] **Mobile responsiveness check**
  - [ ] Test on iPhone (Safari)
  - [ ] Test on Android (Chrome)
  - [ ] Test hamburger menu works
  - [ ] Test all pages scroll properly

- [ ] **Content accuracy**
  - [ ] About page reads naturally (no generic "I view code as..." if you don't like it)
  - [ ] Skills page lists YOUR actual skills
  - [ ] Projects page has YOUR projects (FieldNote, BooksSquad, enterprise work)
  - [ ] Blog has at least 2 real posts (you have these already!)

### Recommended (Should Do, Quick Fixes)

- [ ] **Add project screenshots**
  - [ ] FieldNote: MapView screenshot or dashboard
  - [ ] BooksSquad: Discovery screen mockup (even if not built yet)
  - [ ] Other projects: Any screenshots you have

- [ ] **Update About page** (if current content feels too generic)
  - Option 1: Keep it as-is for now, update later
  - Option 2: Spend 30 min personalizing the "Philosophy" section

- [ ] **SEO basics**
  - [ ] Update meta descriptions in each page (check src/pages/*.astro frontmatter)
  - [ ] Add Open Graph image (nice-to-have, not critical)

---

## Phase 2: Deploy to Netlify (30 minutes)

### Step 1: Push to GitHub

```bash
cd ~/Desktop/portfolio

# Check git status
git status

# If not a repo yet, initialize
git init
git add .
git commit -m "Initial portfolio site - ready for deployment"

# Create repo on GitHub (via web UI):
# 1. Go to https://github.com/new
# 2. Name: "portfolio" or "davidcontreras-portfolio"
# 3. Public or Private: Public (so recruiters can see source)
# 4. Don't initialize with README (you already have one)

# Push to GitHub
git remote add origin https://github.com/davidcon05/portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Netlify

**Option A: Drag & Drop (Fastest - 5 minutes)**
1. Build locally: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder
4. Your site is live! (URL: random-name-123.netlify.app)

**Option B: GitHub Integration (Recommended - 15 minutes)**
1. Go to https://app.netlify.com (sign up with GitHub)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub → Authorize Netlify → Select "portfolio" repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"
5. Wait 2-3 minutes for build
6. Your site is live!

### Step 3: Custom URL (Optional - 2 minutes)

**Free Netlify subdomain:**
1. In Netlify dashboard: Site settings → Domain management
2. Click "Options" → "Edit site name"
3. Change from `random-name-123` to `davidcontreras` or `dbcontreras`
4. Your site: `davidcontreras.netlify.app`

**Custom domain (costs $12/year):**
1. Buy domain: davidcontreras.dev or davidcontreras.io
2. In Netlify: Add custom domain
3. Configure DNS (Netlify provides instructions)
4. Wait 24-48 hours for DNS propagation

**Recommendation:** Start with free Netlify subdomain, buy custom domain later if needed.

---

## Phase 3: Post-Deployment (After Going Live)

### Immediate (Day 1)

- [ ] **Test live site**
  - [ ] Visit your Netlify URL
  - [ ] Click every link
  - [ ] Download resume (does it work?)
  - [ ] Test on mobile

- [ ] **Share with trusted friends**
  - [ ] Ask 2-3 people to review (spouse, colleague, friend)
  - [ ] "Does anything look broken?"
  - [ ] "Does the About page sound like me?"

- [ ] **Update your resume**
  - [ ] Add portfolio URL to resume header
  - [ ] Update LinkedIn "Websites" section with portfolio link

### Week 1

- [ ] **Analytics setup** (optional but recommended)
  - [ ] Add Google Analytics OR Plausible (privacy-friendly)
  - [ ] Track: page views, top pages, traffic sources

- [ ] **Share on LinkedIn**
  - [ ] Post: "Excited to share my new portfolio! Built with Astro, showcasing my work in mobile testing and AI-assisted development. Check it out: [link]"
  - [ ] Tag: #SoftwareTesting #MobileEngineering #AI

- [ ] **Submit to Google**
  - [ ] Go to https://search.google.com/search-console
  - [ ] Add property (your site URL)
  - [ ] Submit sitemap: yourdomain.com/sitemap-index.xml

### Month 1

- [ ] **Write 1-2 more blog posts**
  - [ ] Pick from your top 5 list (Shift-Left with AI, Testing AI Code)
  - [ ] Publish to Dev.to + Medium + your site

- [ ] **Monitor traffic**
  - [ ] Check analytics weekly
  - [ ] See which pages get views
  - [ ] Adjust content based on what resonates

---

## Quick Decision Matrix

**Question: Should I wait to write more content before deploying?**

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Deploy NOW with 2 blog posts** | Site is live, start getting traffic, can update anytime | Fewer blog posts to showcase | ✅ **DO THIS** |
| **Wait, write 4-6 posts first** | More content to impress visitors | Delays launch by 2-4 weeks, perfectionism trap | ❌ Don't wait |

**Answer:** Deploy now. You can add content weekly. A live site beats a perfect site in your head.

---

## Minimal Launch Version (Deploy This Week)

**What you MUST have:**
✅ 2 blog posts (you have these)
✅ About page (you have this)
✅ Projects page (you have this)
✅ Working links (GitHub, LinkedIn, resume)
✅ Mobile responsive (you have this)

**What you DON'T need yet:**
❌ 6+ blog posts (add later)
❌ Project screenshots (add later)
❌ Perfect About page copy (iterate later)
❌ Custom domain (use Netlify subdomain)
❌ Analytics (add after launch)

---

## Deployment Timeline

**Tonight (2 hours):**
1. Build & test locally (30 min)
2. Push to GitHub (15 min)
3. Deploy to Netlify (15 min)
4. Test live site (30 min)
5. Share with spouse for feedback (30 min)

**Tomorrow:**
1. Fix any issues found
2. Update resume with portfolio link
3. Update LinkedIn with portfolio

**This Week:**
1. Share on LinkedIn
2. Submit to Google Search Console
3. Start writing next blog post

**Next Month:**
1. Add 2-3 more blog posts
2. Add project screenshots
3. Consider custom domain ($12/year)

---

## Emergency Contacts (If Something Breaks)

**Netlify Support:**
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com
- Status: https://netlifystatus.com

**Common Issues:**
1. **Build fails:** Check `package.json` scripts match Netlify settings
2. **404 on routes:** Astro needs `output: 'static'` in astro.config.mjs (you have this)
3. **Resume doesn't download:** Check file is in `public/` folder (you have this)
4. **Links broken:** Check all URLs are absolute (https://) not relative

---

## Success Criteria

**You'll know launch was successful when:**
- ✅ You can visit your Netlify URL from any device
- ✅ All links work (GitHub, LinkedIn, email, resume)
- ✅ Site looks good on mobile and desktop
- ✅ You're not embarrassed to share it with recruiters
- ✅ Friends say "this looks professional"

**You DON'T need:**
- ❌ Perfect content (iterate later)
- ❌ Thousands of visitors (growth takes time)
- ❌ Custom domain (Netlify subdomain is fine)
- ❌ Every feature built (add over time)

---

## Next Steps

**Right Now (Choose One):**

**Option A: Deploy Tonight**
1. Run `npm run build && npm run preview`
2. Test everything works
3. Push to GitHub
4. Deploy to Netlify
5. Go live!

**Option B: Final Content Review Tomorrow**
1. Review About page (spend 30 min personalizing if needed)
2. Add 1-2 project screenshots (if you have them handy)
3. Deploy tomorrow night

**Option C: Wait One More Week**
1. Write 1 more blog post ("Shift-Left with AI")
2. Add project screenshots
3. Deploy next weekend

**My Recommendation:** Option A (Deploy Tonight)

**Why?**
- Your site is ready
- You can update content anytime (Netlify auto-deploys on git push)
- Done is better than perfect
- Start getting feedback NOW vs. waiting

---

## The Launch Button

When you're ready:

```bash
# 1. Build
npm run build

# 2. Test
npm run preview

# 3. If it looks good, push to GitHub
git add .
git commit -m "Portfolio v1.0 - ready for deployment"
git push origin main

# 4. Deploy on Netlify (via web UI)
# https://app.netlify.com

# 5. You're live! 🚀
```

---

**Created:** 2026-05-28
**Goal:** Live site by this weekend
**Status:** Ready to deploy
**Blocker:** None - you're ready!
