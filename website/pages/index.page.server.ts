import * as ColorUtils from 'common/utils/color';
import * as CookieUtils from 'common/utils/cookie';
import * as TechNameUtils from 'common/utils/techName';
import { CustomServerPageContext, ServerPageContextInit } from 'renderer/types';

export async function onBeforeRender({
    requestCookie,
}: ServerPageContextInit): Promise<{
    pageContext: CustomServerPageContext;
}> {
    const shouldUseDarkModeCookieItem = CookieUtils.getItem({
        getCookie: () => requestCookie,
        key: 'shouldUseDarkMode',
    });
    const shouldUseDarkMode =
        shouldUseDarkModeCookieItem === null
            ? undefined
            : shouldUseDarkModeCookieItem === 'true';
    const techName = TechNameUtils.getRandomTechName();
    const color = ColorUtils.getColorForTechName(techName);
    const colorCssVariablesByName = ColorUtils.getCssVariablesByName({
        color,
        shouldUseDarkMode,
    });
    const valuesByBaseAtomName = {
        shouldUseDarkModeAtom: shouldUseDarkMode,
        techNameAtom: techName,
    };

    return {
        pageContext: {
            colorCssVariablesByName,
            pageProps: {
                valuesByBaseAtomName,
            },
        },
    };
}
