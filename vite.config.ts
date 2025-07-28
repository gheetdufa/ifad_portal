import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Set to root for GitHub Pages
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'docs', // Output to docs for GitHub Pages
    assetsDir: 'assets',
  },
});
