import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [ /node_modules/]
    }
  },
  optimizeDeps: {
    include: ['@daily-co/daily-js', 'events']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'opposite-joshua-identifies-homes.trycloudflare.com'  
    ]
  }
});
