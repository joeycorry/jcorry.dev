import { createServer as createHttpServer } from 'http';

import { createAppListener } from './app';
import { port } from './config';

async function startServer(): Promise<void> {
    const server = createHttpServer();
    const appListener = await createAppListener({ server });

    server.on('request', appListener);
    server.on('listening', () => {
        console.log(`Serving at http://localhost:${port}`);
    });
    server.listen(port);
}

startServer();
