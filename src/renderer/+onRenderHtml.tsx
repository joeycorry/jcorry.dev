import { renderToReadableStream } from 'react-dom/server.browser';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';

import {
    createFaviconElementString,
    createHtmlAttributesString,
    createMetaElementStrings,
    createTitleElementString,
} from './documentProps';
import { rootHtmlId } from './root';
import type { ServerPageContext } from './types';

async function render(
    pageContext: ServerPageContext,
): Promise<ReturnType<typeof escapeInject>> {
    const { Page, pageProps } = pageContext;
    const readableStream = await renderToReadableStream(
        <Page {...pageProps} />,
    );
    const htmlAttributes = createHtmlAttributesString({ pageContext });
    const faviconElementString = createFaviconElementString({ pageContext });
    const metaElementStrings = createMetaElementStrings({ pageContext });
    const titleElementString = createTitleElementString({ pageContext });

    return escapeInject`
      <!DOCTYPE html>
      <html ${dangerouslySkipEscape(htmlAttributes)}>
        <head>
          ${dangerouslySkipEscape(metaElementStrings.join('\n'))}
          ${dangerouslySkipEscape(faviconElementString)}
          ${dangerouslySkipEscape(titleElementString)}
        </head>
        <body>
          <div id="${rootHtmlId}">${readableStream}</div>
        </body>
      </html>
    `;
}

// eslint-disable-next-line import/no-default-export
export default render;
