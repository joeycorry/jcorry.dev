import { getCookie } from 'h3';

import { colorSchemeAtom } from '~/common/atoms/color';
import { techNameAtom } from '~/common/atoms/techName';
import {
    createColorVariantCssValuesByName,
    getColor,
} from '~/common/utils/color';
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

async function onBeforeRender({
    originalEvent,
}: ServerPageContext): Promise<ServerOnBeforeRenderResult<PageProps>> {
    const colorSchemeCookie = getCookie(originalEvent, 'colorScheme');
    const jotaiStoreAtomSetValueParametersByName: JotaiStoreAtomSetValueParametersByName =
        {
            colorScheme: [
                colorSchemeCookie !== 'dark' && colorSchemeCookie !== 'light'
                    ? 'unknown'
                    : colorSchemeCookie,
            ],
            techName: [getRandomTechName()],
        };
    const jotaiStore = createJotaiStore({
        atomSetValueParametersByName: jotaiStoreAtomSetValueParametersByName,
    });
    const colorScheme = jotaiStore.get(colorSchemeAtom);
    const techName = jotaiStore.get(techNameAtom);
    const color = getColor(techName);
    const faviconElementString = createFaviconElementString(color);
    const colorVariantCssValuesByName = createColorVariantCssValuesByName({
        colorScheme,
        techName,
    });
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

// eslint-disable-next-line import/no-default-export
export default onBeforeRender;
