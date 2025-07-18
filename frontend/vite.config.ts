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
  define: {
    // Provide an empty object for process.env so imported code that checks env vars does not crash in browser
    'process.env': {},
  },
  build: {
    lib: {
      entry: 'src/mountEvents.tsx',
      name: 'KosgeEvents',
      formats: ['iife'],
      fileName: () => 'kosge-events.js',
    },
    outDir: 'public', // Keep build output compatible with existing Netlify config
    emptyOutDir: true,
    rollupOptions: {
      // Ensure React is bundled so no external dependency is required on the static site
      external: [],
    },
  },
});