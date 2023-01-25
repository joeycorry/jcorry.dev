import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import ssr from 'vite-plugin-ssr/plugin';

import packageJson from './package.json' assert { type: 'json' };

const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.JCORRY_DEV_VITE_PORT || '3001');

function getEsmUrl(importPath: string) {
    const importPathSegments = importPath.split('/');
    const [baseImportPath, subImportPath] = [
        importPathSegments[0],
        importPathSegments.slice(1).join('/'),
    ];

    const version =
        packageJson.dependencies[
            baseImportPath as keyof typeof packageJson.dependencies
        ];

    if (!version) {
        throw new Error('Invalid import path');
    }

    return `https://esm.sh/${baseImportPath}@${version}${
        subImportPath ? `/${subImportPath}` : ''
    }`;
}

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
            common: fileURLToPath(new URL('./common', import.meta.url)),
            pages: fileURLToPath(new URL('./pages', import.meta.url)),
            renderer: fileURLToPath(new URL('./renderer', import.meta.url)),
            server: fileURLToPath(new URL('./server', import.meta.url)),
            ...(isProduction
                ? Object.fromEntries(
                      [
                          'jotai',
                          'react-dom/client',
                          'react-dom/server.browser',
                          'react-feather',
                          'react/jsx-runtime',
                          'react',
                      ].map(importPath => [importPath, getEsmUrl(importPath)])
                  )
                : {}),
        },
    },
    server: {
        hmr: {
            clientPort: 443,
            path: '/vite',
            port,
        },
        port,
        proxy: {
            '/vite': {
                target: 'ws://vite.jcorry-dev.local',
                ws: true,
            },
        },
        strictPort: true,
    },
});
