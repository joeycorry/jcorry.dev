import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { removeCookie, setCookie } from '~/common/utils/cookie';

export function useMediaQueryListChangeHandler() {
    const setShouldUseDarkMode = useSetAtom(shouldUseDarkModeAtom);

    return useCallback(
        ({ matches }: MediaQueryListEvent) => {
            setShouldUseDarkMode(matches);
        },
        [setShouldUseDarkMode]
    );
}

export function useShouldUseDarkModeEffects() {
    const [shouldUseDarkMode, setShouldUseDarkMode] = useAtom(
        shouldUseDarkModeAtom
    );
    const handleMediaQueryListChange = useMediaQueryListChangeHandler();

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

        mediaQueryList.addEventListener('change', handleMediaQueryListChange);

        return () => {
            mediaQueryList.removeEventListener(
                'change',
                handleMediaQueryListChange
            );
        };
    }, [setShouldUseDarkMode, handleMediaQueryListChange]);

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
