import { hydrateRoot } from 'react-dom/client';

import { rootHtmlId } from './root';
import type { ClientPageContext } from './types';

async function render({ Page, pageProps }: ClientPageContext) {
    hydrateRoot(
        window.document.getElementById(rootHtmlId)!,
        <Page {...pageProps} />,
    );
}

// eslint-disable-next-line import/no-default-export
export default render;
