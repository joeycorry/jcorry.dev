import { colorAtom } from '~/common/atoms/color';
import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { getColorVariantCssValuesByName } from '~/common/utils/color';
import { getCookie } from '~/common/utils/cookie';
import type { JotaiStoreAtomSetValueParametersByName } from '~/common/utils/jotaiStore';
import { createJotaiStore } from '~/common/utils/jotaiStore';
import { getRandomTechName } from '~/common/utils/techName';
import {
    ServerOnBeforeRenderResult,
    ServerPageContext,
} from '~/renderer/types';

import type { PageProps } from './index.page';
import defaultStyle from './index.page.css?inline';

const title = process.env.JCORRY_DEV_DOCUMENT_TITLE || 'Joey Corry';

export async function onBeforeRender({
    originalRequest,
}: ServerPageContext): Promise<ServerOnBeforeRenderResult<PageProps>> {
    const requestCookie = originalRequest.header('cookie') || '';
    const shouldUseDarkModeCookie = getCookie({
        getCookies: () => requestCookie,
        key: 'shouldUseDarkMode',
    });
    const jotaiStoreAtomSetValueParametersByName: JotaiStoreAtomSetValueParametersByName =
        {
            shouldUseDarkMode: [
                shouldUseDarkModeCookie === null
                    ? undefined
                    : shouldUseDarkModeCookie === 'true',
            ],
            techName: [getRandomTechName()],
        };
    const jotaiStore = createJotaiStore(jotaiStoreAtomSetValueParametersByName);
    const colorVariantCssValuesByName = getColorVariantCssValuesByName({
        color: jotaiStore.get(colorAtom),
        shouldUseDarkMode: jotaiStore.get(shouldUseDarkModeAtom),
    });
    const htmlStyle = `${Object.entries(colorVariantCssValuesByName)
        .map(([name, value]) => `${name}:${value}`)
        .join('; ')};`;

    return {
        pageContext: {
            documentProps: {
                defaultStyle,
                htmlAttributes: {
                    style: htmlStyle,
                },
                title,
            },
            pageProps: {
                jotaiStoreAtomSetValueParametersByName,
            },
        },
    };
}
