# David Contreras - Portfolio Website

Personal portfolio showcasing mobile quality engineering expertise, technical projects, and engineering blog.

**Live Site:** https://davidcon05.github.io/portfolio

**Location:** `~/davidcontreras/portfolio/`

## Quick Start

**To deploy right now:** See `DEPLOY_NOW.md` (5-minute guide)

**For detailed deployment:** See `GITHUB_PAGES_DEPLOYMENT.md`

## Tech Stack

- **Framework**: Astro 6.3.7
- **Styling**: Tailwind CSS v4
- **Design System**: Material Design 3 tokens
- **Icons**: Material Symbols
- **Hosting**: GitHub Pages (free)
- **Deployment**: GitHub Actions (auto-deploy on push to main)

## Project Structure

```text
/
├── public/
│   └── dcontreras-resume-2026.pdf    # Resume PDF
├── src/
│   ├── components/
│   │   ├── TopNavBar.astro           # Main navigation with mobile hamburger
│   │   ├── Footer.astro              # Footer with social links
│   │   ├── BlogCard.astro            # Blog post card component
│   │   └── Sidebar.astro             # Resume highlights sidebar
│   ├── content/
│   │   └── blog/                     # Blog posts (Markdown)
│   ├── layouts/
│   │   └── BaseLayout.astro          # Base layout template
│   ├── pages/
│   │   ├── index.astro               # Homepage (Projects showcase)
│   │   ├── about.astro               # About page
│   │   ├── skills.astro              # Skills & expertise
│   │   └── blog/
│   │       ├── index.astro           # Blog index
│   │       └── [slug].astro          # Blog post template
│   └── styles/
│       └── global.css                # Global styles & MD3 tokens
└── package.json
```

## Development

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Checklist

### Pre-Launch Tasks
- [x] Update GitHub link to https://github.com/davidcon05
- [x] Update LinkedIn link to https://www.linkedin.com/in/dbcontreras/
- [x] Add resume PDF (dcontreras-resume-2026.pdf)
- [x] Update email to david.b.contreras@gmail.com
- [x] Update location to Raleigh, NC
- [x] Mobile responsiveness verified
- [ ] **Write blog content** (currently has 2 placeholder posts)
- [ ] **Update About page content** (philosophy, technical pedigree)
- [ ] **Add project screenshots/demos**
- [ ] **Update project descriptions** with real metrics
- [ ] Test all links (GitHub, LinkedIn, Resume download, Email)
- [ ] Test on mobile devices
- [ ] SEO: Update meta descriptions
- [ ] SEO: Add Open Graph images
- [ ] Analytics setup (Google Analytics or Plausible)

### Content to Write
1. **Blog Posts**:
   - Currently: 2 posts (1 iOS dev, 1 Android testing)
   - Recommended: 4-6 quality posts before launch

2. **About Page**:
   - Philosophy & Identity section needs personalization
   - Technical Pedigree section is styled but generic content

3. **Projects**:
   - Add screenshots for FieldNote, A1C Tracker, NFC Menu System, SecureVault
   - Update metrics with real data
   - Add demo videos/GIFs if available

### Deployment Options

**Recommended: Netlify**
```bash
# Build command: npm run build
# Publish directory: dist
# Add environment variables if needed
```

**Alternative: Vercel**
```bash
# Framework Preset: Astro
# Build command: npm run build
# Output directory: dist
```

### Custom Domain Setup
1. Purchase domain (davidcontreras.dev, davidcontreras.io, etc.)
2. Configure DNS records
3. Enable HTTPS
4. Set up redirects (www → non-www or vice versa)

### Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Set up monitoring (uptime, performance)
- [ ] Share on LinkedIn
- [ ] Add to resume

## Key Features

✅ **Responsive Design**: Mobile-first with breakpoints at 768px (md) and 1024px (lg)
✅ **Blog System**: Markdown-based with content collections
✅ **Highlighted Content**: Latest blog post and CORE_EXPERTISE sections use signature blue (#acedff) styling
✅ **Mobile Navigation**: Hamburger menu for small screens
✅ **Download Resume**: PDF download with HR-friendly filename
✅ **Performance**: Static site generation for fast load times

## Design Decisions

- **Color Scheme**: Dark theme with Material Design 3 tokens
- **Signature Color**: #acedff (light blue) for CORE_EXPERTISE and latest blog post
- **Typography**: System fonts for performance, Material Symbols for icons
- **Layout**: Projects page uses asymmetric grid (FieldNote: 66%, others: 33%)
- **Mobile**: Blog sidebar appears after posts, not before

## License

Personal portfolio - All rights reserved.
