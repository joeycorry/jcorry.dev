import { colorAtom } from 'common/atoms/color';
import { shouldUseDarkModeAtom } from 'common/atoms/shouldUseDarkMode';
import * as ColorUtils from 'common/utils/color';
import * as CookieUtils from 'common/utils/cookie';
import * as JotaiUtils from 'common/utils/jotai';
import * as TechNameUtils from 'common/utils/techName';
import { ServerOnBeforeRenderResult, ServerPageContext } from 'renderer/types';

import type { PageProps } from './index.page';
import defaultStyle from './index.page.css?inline';

const title = process.env.JCORRY_DEV_DOCUMENT_TITLE || 'Joey Corry';

export async function onBeforeRender({
    originalRequest,
}: ServerPageContext): Promise<ServerOnBeforeRenderResult<PageProps>> {
    const requestCookie = originalRequest.header('cookie') || '';
    const shouldUseDarkModeCookieValue = CookieUtils.getItem({
        getCookie: () => requestCookie,
        key: 'shouldUseDarkMode',
    });
    const jotaiStoreSetParametersByName: JotaiUtils.JotaiStoreSetParametersByName =
        {
            shouldUseDarkMode: [
                shouldUseDarkModeCookieValue === null
                    ? undefined
                    : shouldUseDarkModeCookieValue === 'true',
            ],
            techName: [TechNameUtils.getRandomTechName()],
        };
    const jotaiStore = JotaiUtils.createJotaiStore(
        jotaiStoreSetParametersByName
    );
    const colorCssVariablesByName = ColorUtils.getCssVariablesByName({
        color: jotaiStore.get(colorAtom),
        shouldUseDarkMode: jotaiStore.get(shouldUseDarkModeAtom),
    });
    const htmlStyle = Object.entries(colorCssVariablesByName)
        .map(([name, value]) => `${name}:${value}`)
        .join('; ');

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
                jotaiStoreSetParametersByName,
            },
        },
    };
}
