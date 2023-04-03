import { hydrateRoot } from 'react-dom/client';

import { rootHtmlId } from './root';
import type { ClientPageContext } from './types';

export async function render({ Page, pageProps }: ClientPageContext) {
    hydrateRoot(
        window.document.getElementById(rootHtmlId)!,
        <Page {...pageProps} />
    );
}
