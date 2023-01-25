import { renderToReadableStream } from 'react-dom/server.browser';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';

import styles from './_default.css?inline';
import type { ServerPageContext } from './types';

export const passToClient = ['pageProps'];

const documentTitle = process.env.JCORRY_DEV_DOCUMENT_TITLE || 'Joey Corry';

export async function render(pageContext: ServerPageContext) {
    const { colorCssVariablesByName, Page, pageProps } = pageContext;
    const htmlStyleString = Object.entries(colorCssVariablesByName)
        .map(([name, value]) => `${name}:${value}`)
        .join('; ');
    const readableStream = await renderToReadableStream(
        <Page {...pageProps} />
    );

    return escapeInject`
      <!DOCTYPE html>
      <html style="${dangerouslySkipEscape(htmlStyleString)}">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${dangerouslySkipEscape(documentTitle)}</title>
          <style>${dangerouslySkipEscape(styles)}</style>
        </head>
        <body>
          <div id="root">${readableStream}</div>
        </body>
      </html>
    `;
}
