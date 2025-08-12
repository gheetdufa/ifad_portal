import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: '/', // AWS hosting - no base path needed
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    // Use .env files for VITE_API_URL; do not override here
    build: {
      outDir: 'dist', // Standard output directory for AWS
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
    },
  };
});
