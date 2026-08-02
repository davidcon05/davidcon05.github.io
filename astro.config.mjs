// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://davidcon05.github.io',
  // /blog and / were two blog indexes with different layouts, and nothing in the
  // nav pointed at /blog — people always landed on /. The homepage now carries
  // the Featured + All Posts structure, so /blog redirects rather than drifting.
  redirects: {
    '/blog': '/',
  },
  markdown: {
    // Shiki injects inline styles on <pre> — a dark background and a colour per
    // token — and inline styles beat the site's classes. On a light page that
    // renders as a dark block full of rainbow text. Turning it off lets code
    // blocks be styled by the design system like everything else.
    syntaxHighlight: false,
  },
  // No base path needed when repo name is davidcon05.github.io
  vite: {
    plugins: [tailwindcss()]
  }
});