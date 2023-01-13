import { hydrateRoot } from 'react-dom/client';

import { ClientPageContext } from './types';

export async function render(pageContext: ClientPageContext) {
    const { Page, pageProps } = pageContext;

    hydrateRoot(
        window.document.getElementById('root')!,
        <Page {...pageProps} />
    );
}
