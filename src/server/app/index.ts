import { createApp, toNodeListener } from 'h3';
import { useCompressionStream } from 'h3-compression';
import type { RequestListener, Server } from 'http';

import { addMiddlewares } from './middleware';
import { addRoutes } from './routes';

export async function createAppListener({
    server,
}: {
    server: Server;
}): Promise<RequestListener> {
    const app = createApp({ onBeforeResponse: useCompressionStream });

    await addMiddlewares({ app, server });
    addRoutes({ app });

    return toNodeListener(app);
}
