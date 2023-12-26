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

const __dirname = new URL('.', import.meta.url).pathname.slice(0, -1);
const root = `${__dirname}/..`;

const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.JCORRY_DEV_SERVER_PORT || '3000');

async function startServer() {
    const app = createApp({ onBeforeResponse: useCompressionStream });

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

    app.use(
        '*',
        eventHandler(async event => {
            const { httpResponse: vikeResponse } = await renderPage({
                originalEvent: event,
                urlOriginal: event.path,
            });

            if (!vikeResponse) {
                setResponseStatus(event, 404);

                return 'Invalid page.';
            }

            const { earlyHints, statusCode } = vikeResponse;

            setResponseStatus(event, statusCode);
            setResponseHeaders(event, Object.fromEntries(vikeResponse.headers));

            if (earlyHints) {
                writeEarlyHints(event, {
                    link: earlyHints.map(({ earlyHintLink }) => earlyHintLink),
                });
            }

            return vikeResponse.getReadableWebStream();
        }),
    );

    createServer(toNodeListener(app)).listen(port);
    console.log(`Serving at http://localhost:${port}`);
}

startServer();
