import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        infrastructure: resolve(__dirname, 'infrastructure-management.html'),
        energy: resolve(__dirname, 'energy-management.html'),
        logistics: resolve(__dirname, 'logistics-management.html'),
        logisticsCommand: resolve(__dirname, 'logistics-command-center.html'),
        environmental: resolve(__dirname, 'environmental-monitoring.html'),
      },
    },
  },
});
