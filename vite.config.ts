import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const base = mode === 'production' ? '/ifad_portal/' : '/';
  
  return {
    plugins: [react()],
    base,
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'docs',
      assetsDir: 'assets',
      sourcemap: true, // Enable sourcemaps for debugging
    },
  };
});
