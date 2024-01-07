import type { App, H3Event } from 'h3';
import {
    createApp,
    eventHandler,
    fromNodeMiddleware,
    getHeader,
    setResponseHeader,
    setResponseHeaders,
    setResponseStatus,
    toNodeListener,
    writeEarlyHints,
} from 'h3';
import { useCompressionStream } from 'h3-compression';
import { createServer } from 'http';
import { URL } from 'url';
import { renderPage } from 'vike/server';
import type { UserConfig } from 'vite';

import type { ServerPageContext } from '~/renderer/types';

const __dirname = new URL('.', import.meta.url).pathname.slice(0, -1);
const root = `${__dirname}/..`;

const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.JCORRY_DEV_SERVER_PORT || '3000');

async function addMiddleware(app: App): Promise<void> {
    if (isProduction) {
        const sirv = (await import('sirv')).default;

        app.use(fromNodeMiddleware(sirv(`${root}/dist/client`)));
    } else {
        const vite = await import('vite');
        const viteConfig: UserConfig = await import(`${root}/vite.config.js`);
        const viteDevMiddleware = (
            await vite.createServer(
                vite.mergeConfig(viteConfig, {
                    root,
                    server: {
                        middlewareMode: true,
                    },
                }),
            )
        ).middlewares;

        app.use(fromNodeMiddleware(viteDevMiddleware));
    }
}

function addOkRoute(app: App): void {
    app.use(
        '/ok',
        eventHandler(event => {
            if (event.method !== 'GET') {
                setResponseStatus(event, 405);

                return '';
            }

            setResponseStatus(event, 200);
            setResponseHeader(event, 'Content-Type', 'text/plain');

            const hostname = getHeader(event, 'host');

            return `${hostname} is OK!`;
        }),
    );
}

function addVikeRoutes(app: App): void {
    app.use(
        '*',
        eventHandler(async event => {
            const vikeResponse = await renderPage<
                ServerPageContext,
                { originalEvent: H3Event; urlOriginal: string }
            >({
                originalEvent: event,
                urlOriginal: event.path,
            });

            const vikeHttpResponse = vikeResponse.httpResponse!;
            const { earlyHints, statusCode } = vikeHttpResponse!;

            setResponseStatus(event, statusCode);
            setResponseHeaders(
                event,
                Object.fromEntries(vikeHttpResponse.headers),
            );

            if (earlyHints) {
                writeEarlyHints(event, {
                    link: earlyHints.map(({ earlyHintLink }) => earlyHintLink),
                });
            }

            return vikeHttpResponse.getReadableWebStream();
        }),
    );
}

async function startServer(): Promise<void> {
    const app = createApp({ onBeforeResponse: useCompressionStream });

    await addMiddleware(app);
    addOkRoute(app);
    addVikeRoutes(app);
    createServer(toNodeListener(app)).listen(port);
    console.log(`Serving at http://localhost:${port}`);
}

startServer();
