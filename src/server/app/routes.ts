import type { App, H3Event } from 'h3';
import {
    eventHandler,
    getHeader,
    setResponseHeader,
    setResponseHeaders,
    setResponseStatus,
    writeEarlyHints,
} from 'h3';
import { renderPage } from 'vike/server';

import type { ServerPageContext } from '~/renderer/types';

export function addRoutes({ app }: { app: App }): void {
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
        '/',
        eventHandler(async event => {
            const vikeResponse = await renderPage<
                ServerPageContext,
                { originalEvent: H3Event; urlOriginal: string }
            >({
                originalEvent: event,
                urlOriginal: event.path,
            });

            const vikeHttpResponse = vikeResponse.httpResponse!;

            if (!vikeHttpResponse) {
                setResponseStatus(event, 404);

                return 'Page not found!';
            }

            const { earlyHints, statusCode } = vikeHttpResponse;

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
