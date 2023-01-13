import compression from 'compression';
import express from 'express';
import { URL } from 'url';
import type { UserConfig } from 'vite';
import { renderPage } from 'vite-plugin-ssr';

const __dirname = new URL('.', import.meta.url).pathname.slice(0, -1);
const root = `${__dirname}/..`;

const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
    const app = express();

    app.use(compression());

    if (isProduction) {
        const sirv = (await import('sirv')).default;

        app.use(sirv(`${root}/dist/client`));
    } else {
        const vite = await import('vite');
        const viteConfig = (await import('../vite.config.js')) as UserConfig;
        const viteDevMiddleware = (
            await vite.createServer(
                vite.mergeConfig(viteConfig, {
                    root,
                    server: {
                        middlewareMode: true,
                    },
                })
            )
        ).middlewares;

        app.use(viteDevMiddleware);
    }

    app.get('*', async (req, res, next) => {
        const pageContextInit = {
            requestCookie: req.header('cookie') || '',
            urlOriginal: req.originalUrl,
        };
        const pageContext = await renderPage(pageContextInit);
        const { httpResponse } = pageContext;

        if (!httpResponse) {
            return next();
        }

        const { body, statusCode, contentType, earlyHints } = httpResponse;

        if (res.writeEarlyHints) {
            res.writeEarlyHints({ link: earlyHints.map(e => e.earlyHintLink) });
        }

        res.status(statusCode).type(contentType).send(body);
    });

    const port = 3000;

    app.listen(port);
    console.log(`Serving at http://localhost:${port}`);
}

startServer();
