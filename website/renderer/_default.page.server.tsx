import { renderToReadableStream } from 'react-dom/server.browser';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';

import {
    getDefaultStyleString,
    getHtmlAttributesString,
    getTitleString,
} from './documentProps';
import { rootHtmlId } from './root';
import type { ServerPageContext } from './types';

export const passToClient = ['pageProps'];

export async function render(pageContext: ServerPageContext) {
    const { Page, pageProps } = pageContext;
    const readableStream = await renderToReadableStream(
        <Page {...pageProps} />
    );

    return escapeInject`
      <!DOCTYPE html>
      <html ${dangerouslySkipEscape(getHtmlAttributesString(pageContext))}>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${getTitleString(pageContext)}</title>
          <style>${dangerouslySkipEscape(
              getDefaultStyleString(pageContext)
          )}</style>
        </head>
        <body class="no-transition">
          <div id="${rootHtmlId}">${readableStream}</div>
        </body>
      </html>
    `;
}
