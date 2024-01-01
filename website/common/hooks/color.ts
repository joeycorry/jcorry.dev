import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

import {
    colorSchemeAtom,
    colorVariantSubjectsByNameAtom,
} from '~/common/atoms/color';
import { techNameAtom } from '~/common/atoms/techName';
import { getRendererManager } from '~/common/lib/rendererManager';
import { createColorVariantSubjectsByNameTransitionRenderer } from '~/common/renderers/color';
import {
    createColorVariantCssVariableSetter,
    getColorVariantNames,
} from '~/common/utils/color';
import { removeCookie, setCookie } from '~/common/utils/cookie';
import { setFaviconColor } from '~/common/utils/favicon';
import { setThemeColor } from '~/common/utils/meta';
import type { UnregisterObserverCallback } from '~/common/utils/subject';

function useColorEffects() {
    const rendererManager = getRendererManager();
    const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom);
    const previousColorSchemeRef = useRef(colorScheme);
    const colorVariantSubjectsByName = useAtomValue(
        colorVariantSubjectsByNameAtom,
    );
    const techName = useAtomValue(techNameAtom);
    const previousTechNameRef = useRef(techName);
    const handleMediaQueryListPrefersColorSchemeChange =
        useMediaQueryListPrefersColorSchemeChangeHandler();

    useEffect(() => {
        if (colorScheme === 'normal') {
            setColorScheme(
                window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light',
            );
        }
    }, [setColorScheme, colorScheme]);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            '(prefers-color-scheme: dark)',
        );

        mediaQueryList.addEventListener(
            'change',
            handleMediaQueryListPrefersColorSchemeChange,
        );

        return () =>
            mediaQueryList.removeEventListener(
                'change',
                handleMediaQueryListPrefersColorSchemeChange,
            );
    }, [setColorScheme, handleMediaQueryListPrefersColorSchemeChange]);

    useEffect(() => {
        if (colorScheme === undefined) {
            removeCookie({
                key: 'colorScheme',
                setCookies: cookie => {
                    window.document.cookie = cookie;
                },
            });
        } else {
            setCookie({
                key: 'colorScheme',
                setCookies: cookie => {
                    window.document.cookie = cookie;
                },
                value: colorScheme,
            });
        }
    }, [colorScheme]);

    useEffect(() => {
        const previousColorScheme = previousColorSchemeRef.current;
        previousColorSchemeRef.current = colorScheme;
        const previousTechName = previousTechNameRef.current;
        previousTechNameRef.current = techName;
        const colorVariantSubjectsByNameTransitionRenderer =
            createColorVariantSubjectsByNameTransitionRenderer({
                animationDuration: 800,
                colorVariantSubjectsByName,
                newColorScheme: colorScheme,
                newTechName: techName,
                previousColorScheme,
                previousTechName,
            });

        return rendererManager.registerRenderer(
            colorVariantSubjectsByNameTransitionRenderer,
        );
    }, [rendererManager, colorScheme, colorVariantSubjectsByName, techName]);

    useEffect(() => {
        const colorVariantNames = getColorVariantNames();
        const unregisterObserverCallbacks: Array<UnregisterObserverCallback> =
            [];

        for (const colorVariantName of colorVariantNames) {
            const colorVariantSubject =
                colorVariantSubjectsByName[colorVariantName];
            const setColorVariantCssVariable =
                createColorVariantCssVariableSetter({
                    colorVariantName,
                });

            unregisterObserverCallbacks.push(
                colorVariantSubject.registerObserver(
                    setColorVariantCssVariable,
                ),
            );
        }

        const secondaryForegroundColorSubject =
            colorVariantSubjectsByName.secondaryForegroundColor;

        unregisterObserverCallbacks.push(
            secondaryForegroundColorSubject.registerObserver(setFaviconColor),
        );
        unregisterObserverCallbacks.push(
            secondaryForegroundColorSubject.registerObserver(setThemeColor),
        );

        return () => {
            for (const unregisterObserver of unregisterObserverCallbacks) {
                unregisterObserver();
            }
        };
    }, [colorVariantSubjectsByName]);
}

function useMediaQueryListPrefersColorSchemeChangeHandler() {
    const setColorScheme = useSetAtom(colorSchemeAtom);

    return useCallback(
        ({ matches }: MediaQueryListEvent) => {
            setColorScheme(matches ? 'dark' : 'light');
        },
        [setColorScheme],
    );
}

export { useColorEffects };
