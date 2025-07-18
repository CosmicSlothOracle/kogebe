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
    lib: {
      entry: 'src/mountEvents.tsx',
      name: 'KosgeEvents',
      formats: ['iife'],
      fileName: () => 'kosge-events.js',
    },
    outDir: '../docs/react', // Output inside docs for progressive enhancement
    emptyOutDir: true,
    rollupOptions: {
      // Ensure React is bundled so no external dependency is required on the static site
      external: [],
    },
  },
});