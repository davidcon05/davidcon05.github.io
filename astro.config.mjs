// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://davidcon05.github.io',
  // No base path needed when repo name is davidcon05.github.io
  vite: {
    plugins: [tailwindcss()]
  }
});