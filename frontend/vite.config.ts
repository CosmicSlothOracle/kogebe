import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 5000,
  },
  build: {
    outDir: 'public', // Keep build output compatible with existing Netlify config
    emptyOutDir: true,
  },
});