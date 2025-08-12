import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Permite conexiones desde cualquier IP
    port: 5173,
    strictPort: false, // Permite cambiar automáticamente a otro puerto si 5173 está ocupado
    open: true,
    proxy: {
      '/api': {
        target: 'https://vemat.onrender.com',
        changeOrigin: true,
        secure: false,
        
      },
    },
  },
});
