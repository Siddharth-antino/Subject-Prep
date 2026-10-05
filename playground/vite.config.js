import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), 'PREP_');
  const apiTarget = `http://127.0.0.1:${env.PREP_PORT || 8788}`;
  return {
    plugins: [react()],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              },
            ],
          },
        },
      },
    },
    preview: {
      host: '127.0.0.1',
      port: Number(env.PREP_PREVIEW_PORT || 4174),
      strictPort: true,
      proxy: { '/api/preparation': { target: apiTarget, ws: true } },
    },
    server: {
      host: '127.0.0.1',
      port: Number(env.PREP_WEB_PORT || 5174),
      strictPort: true,
      proxy: { '/api/preparation': { target: apiTarget, ws: true } },
      fs: {
        allow: ['..'],
        deny: [
          '.env',
          '.env.*',
          '*.{crt,pem,key}',
          '**/.git/**',
          '**/.sessions/**',
          '**/.interviews/**',
          '**/server/**',
        ],
      },
    },
    resolve: {
      alias: {
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      },
    },
  };
});
