import { colorSchemeAtom } from '~/common/atoms/color';
import { techNameAtom } from '~/common/atoms/techName';
import {
    getColorVariantCssValuesByName,
    getColorVariantsByName,
} from '~/common/utils/color';
import { getCookie } from '~/common/utils/cookie';
import type { JotaiStoreAtomSetValueParametersByName } from '~/common/utils/jotaiStore';
import { createJotaiStore } from '~/common/utils/jotaiStore';
import { getRandomTechName } from '~/common/utils/techName';
import type {
    ServerOnBeforeRenderResult,
    ServerPageContext,
} from '~/renderer/types';

import type { PageProps } from './+Page';

const title = process.env.JCORRY_DEV_DOCUMENT_TITLE || 'Joey Corry';

// eslint-disable-next-line import/no-default-export
export default async function onBeforeRender({
    originalRequest,
}: ServerPageContext): Promise<ServerOnBeforeRenderResult<PageProps>> {
    const requestCookie = originalRequest.header('cookie') || '';
    const colorSchemeCookie = getCookie({
        getCookies: () => requestCookie,
        key: 'colorScheme',
    });
    const jotaiStoreAtomSetValueParametersByName: JotaiStoreAtomSetValueParametersByName =
        {
            colorScheme: [
                colorSchemeCookie !== 'dark' && colorSchemeCookie !== 'light'
                    ? 'normal'
                    : colorSchemeCookie,
            ],
            techName: [getRandomTechName()],
        };
    const jotaiStore = createJotaiStore(jotaiStoreAtomSetValueParametersByName);
    const colorVariantsByName = getColorVariantsByName({
        colorScheme: jotaiStore.get(colorSchemeAtom),
        techName: jotaiStore.get(techNameAtom),
    });
    const colorVariantCssValuesByName =
        getColorVariantCssValuesByName(colorVariantsByName);
    const htmlStyle = `${Object.entries(colorVariantCssValuesByName)
        .map(([name, value]) => `${name}:${value}`)
        .join('; ')};`;

    return {
        pageContext: {
            documentProps: {
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
