import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path: '/tags-modal/' when deployed to GitHub Pages, '/' for local dev.
// Override via VITE_BASE env var if deploying elsewhere.
const base = process.env.VITE_BASE ?? (process.env.NODE_ENV === 'production' ? '/tags-modal/' : '/');

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    // Default multi-file output. Icons from public/icons/ are copied as-is
    // to dist/icons/ and served statically — never inlined (they're PNG-like
    // binary-size SVGs that would bloat the JS bundle).
    assetsInlineLimit: 0,
  },
});
