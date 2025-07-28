import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : '/ifad_portal/';
  
  return {
    plugins: [react()],
    base, // '/' for dev server, '/ifad_portal/' for build
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'docs',
      assetsDir: 'assets',
      sourcemap: true,
    },
  };
});
