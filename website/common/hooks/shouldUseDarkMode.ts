import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { removeCookie, setCookie } from '~/common/utils/cookie';

export function useShouldUseDarkModeEffects() {
    const [shouldUseDarkMode, setShouldUseDarkMode] = useAtom(
        shouldUseDarkModeAtom
    );

    useEffect(() => {
        if (shouldUseDarkMode === undefined) {
            setShouldUseDarkMode(
                window.matchMedia('(prefers-color-scheme: dark)').matches
            );
        }
    }, [setShouldUseDarkMode, shouldUseDarkMode]);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            '(prefers-color-scheme: dark)'
        );
        const changeListener = (event: MediaQueryListEvent) =>
            setShouldUseDarkMode(event.matches);

        mediaQueryList.addEventListener('change', changeListener);

        return () =>
            mediaQueryList.removeEventListener('change', changeListener);
    }, [setShouldUseDarkMode]);

    useEffect(() => {
        if (shouldUseDarkMode === undefined) {
            removeCookie({
                key: 'shouldUseDarkMode',
                setCookies: cookie => {
                    window.document.cookie = cookie;
                },
            });
        } else {
            setCookie({
                key: 'shouldUseDarkMode',
                setCookies: cookie => {
                    window.document.cookie = cookie;
                },
                value: JSON.stringify(shouldUseDarkMode),
            });
        }
    }, [shouldUseDarkMode]);
}
