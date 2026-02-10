import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    // IMPORTANTE pro GitHub Pages:
    // Se o seu repo é "App-Jaci", a URL fica ...github.io/App-Jaci/
    // Então o base tem que ser exatamente isso:
    base: '/App-Jaci/',

    plugins: [react()],

    server: {
      port: 3000,
      host: true,
    },

    // Build padrão gerando /dist (você já está copiando dist -> docs manualmente)
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
    },

    define: {
      // mantém suas variáveis do jeito que você já usa
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
