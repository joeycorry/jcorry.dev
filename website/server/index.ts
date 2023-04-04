import compression from 'compression';
import express, { Response } from 'express';
import { URL } from 'url';
import type { UserConfig } from 'vite';
import { renderPage } from 'vite-plugin-ssr';

const __dirname = new URL('.', import.meta.url).pathname.slice(0, -1);
const root = `${__dirname}/..`;

const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.JCORRY_DEV_SERVER_PORT || '3000');

async function pipeReadableStreamToExpressResponse<R>(
    readableStream: ReadableStream<R>,
    response: Response
) {
    const streamReader = readableStream.getReader();
    let lastReadResult: ReadableStreamReadResult<R> | undefined;

    while (!lastReadResult?.done) {
        if (lastReadResult !== undefined) {
            response.write(lastReadResult.value);
        }

        lastReadResult = await streamReader.read();
    }

    response.end();
}

async function startServer() {
    const app = express();

    app.use(compression());

    if (isProduction) {
        const sirv = (await import('sirv')).default;

        app.use(sirv(`${root}/dist/client`));
    } else {
        const vite = await import('vite');
        const viteConfig = (await import(
            `${root}/vite.config.js`
        )) as UserConfig;
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
            originalRequest: req,
            urlOriginal: req.originalUrl,
        };
        const pageContext = await renderPage(pageContextInit);
        const { httpResponse } = pageContext;

        if (!httpResponse) {
            return next();
        }

        const { statusCode, contentType } = httpResponse;
        const readableStream = httpResponse.getReadableWebStream();

        await pipeReadableStreamToExpressResponse(
            readableStream,
            res.status(statusCode).type(contentType)
        );
    });

    app.listen(port);
    console.log(`Serving at http://localhost:${port}`);
}

startServer();
