import type { App } from 'h3';
import { fromNodeMiddleware } from 'h3';
import type { Server } from 'http';
import type { UserConfig } from 'vite';

import { isDev, isProduction } from '~/server/config';

async function addViteMiddleware({
    app,
    server,
}: {
    app: App;
    server: Server;
}): Promise<void> {
    const { createServer: createViteDevServer, mergeConfig: mergeViteConfig } =
        await import('vite');
    const { default: viteConfig } = await import('../../../config/vite.config');
    const { middlewares } = await createViteDevServer(
        mergeViteConfig(viteConfig, {
            appType: 'custom',
            server: {
                middlewareMode: true,
                hmr: {
                    server,
                },
            },
        } satisfies UserConfig),
    );
    const eventHandler = fromNodeMiddleware(middlewares);

    app.use(eventHandler);
}

async function addSirvMiddleware({ app }: { app: App }): Promise<void> {
    const { default: sirv } = await import('sirv');

    app.use(fromNodeMiddleware(sirv(`./dist/client`)));
}

export async function addMiddlewares({
    app,
    server,
}: {
    app: App;
    server: Server;
}): Promise<void> {
    if (isDev) {
        await addViteMiddleware({ app, server });
    } else if (isProduction) {
        await addSirvMiddleware({ app });
    }
}
