declare module 'react-dom/server.browser' {
    import { renderToReadableStream } from 'react-dom/server';

    export { renderToReadableStream };
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JCORRY_PORT: string;
        }
    }
}
