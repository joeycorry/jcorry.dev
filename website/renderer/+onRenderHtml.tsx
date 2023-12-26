import { renderToReadableStream } from 'react-dom/server.browser';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';

import { getHtmlAttributesString, getTitleString } from './documentProps';
import { rootHtmlId } from './root';
import type { ServerPageContext } from './types';

// eslint-disable-next-line import/no-default-export
export default async function render(pageContext: ServerPageContext) {
    const { Page, pageProps } = pageContext;
    const readableStream = await renderToReadableStream(
        <Page {...pageProps} />,
    );

    return escapeInject`
      <!DOCTYPE html>
      <html ${dangerouslySkipEscape(getHtmlAttributesString(pageContext))}>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${getTitleString(pageContext)}</title>
        </head>
        <body class="no-transition">
          <div id="${rootHtmlId}">${readableStream}</div>
        </body>
      </html>
    `;
}
