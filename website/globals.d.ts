declare module 'react-dom/server.browser' {
    import { renderToReadableStream } from 'react-dom/server';
    export { renderToReadableStream };
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JCORRY_DEV_VIA_DOCKER: string;
            JCORRY_DEV_DOCUMENT_TITLE: string;
            JCORRY_DEV_SERVER_PORT: string;
            JCORRY_DEV_VITE_PORT: string;
        }
    }
}
