import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import ssr from 'vite-plugin-ssr/plugin';

const isViaDocker = process.env.JCORRY_DEV_IS_VIA_DOCKER === 'true';
const port = parseInt(process.env.JCORRY_DEV_VITE_PORT || '3001');

export default defineConfig({
    build: {
        minify: 'terser',
    },
    plugins: [
        react({
            babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] },
        }),
        ssr(),
    ],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('.', import.meta.url)),
        },
    },
    ...(isViaDocker
        ? {
              server: {
                  hmr: {
                      clientPort: 443,
                      path: '/vite',
                      port,
                  },
                  port,
                  strictPort: true,
              },
          }
        : {}),
});
