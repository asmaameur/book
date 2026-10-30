import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Le proxy évite les problèmes CORS en développement
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:4000' } },
});
