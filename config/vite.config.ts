import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import { fileURLToPath } from 'url';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    build: {
        minify: 'terser',
        target: browserslistToEsbuild(),
    },
    plugins: [
        react({
            babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] },
        }),
        vike(),
    ],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('../src', import.meta.url)),
        },
    },
});
