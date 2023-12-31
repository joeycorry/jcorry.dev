import { getHeader } from 'h3';

import { colorSchemeAtom } from '~/common/atoms/color';
import { techNameAtom } from '~/common/atoms/techName';
import {
    getColorForTechName,
    getColorVariantCssValuesByName,
    getColorVariantsByName,
} from '~/common/utils/color';
import { getCookie } from '~/common/utils/cookie';
import { createFaviconElementString } from '~/common/utils/favicon';
import type { JotaiStoreAtomSetValueParametersByName } from '~/common/utils/jotaiStore';
import { createJotaiStore } from '~/common/utils/jotaiStore';
import { createMetaElementStrings } from '~/common/utils/meta';
import { getRandomTechName } from '~/common/utils/techName';
import type {
    ServerOnBeforeRenderResult,
    ServerPageContext,
} from '~/renderer/types';

import type { PageProps } from './+Page';

const title = process.env.JCORRY_DEV_DOCUMENT_TITLE || 'Joey Corry';

// eslint-disable-next-line import/no-default-export
export default async function onBeforeRender({
    originalEvent,
}: ServerPageContext): Promise<ServerOnBeforeRenderResult<PageProps>> {
    const requestCookie = getHeader(originalEvent, 'cookie') || '';
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
    const techName = jotaiStore.get(techNameAtom);
    const color = getColorForTechName(techName);
    const colorVariantsByName = getColorVariantsByName({
        colorScheme: jotaiStore.get(colorSchemeAtom),
        techName,
    });
    const faviconElementString = createFaviconElementString({ color });
    const colorVariantCssValuesByName =
        getColorVariantCssValuesByName(colorVariantsByName);
    const htmlStyle = `${Object.entries(colorVariantCssValuesByName)
        .map(([name, value]) => `${name}:${value}`)
        .join('; ')};`;
    const metaElementStrings = createMetaElementStrings({ color });

    return {
        pageContext: {
            documentProps: {
                faviconElementString,
                htmlAttributes: {
                    style: htmlStyle,
                },
                metaElementStrings,
                title,
            },
            pageProps: {
                jotaiStoreAtomSetValueParametersByName,
            },
        },
    };
}
