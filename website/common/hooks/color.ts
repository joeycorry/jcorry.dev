import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

import {
    colorSchemeAtom,
    colorVariantSubjectsByNameAtom,
} from '~/common/atoms/color';
import { techNameAtom } from '~/common/atoms/techName';
import { createColorVariantSubjectsByNameTransitionRenderer } from '~/common/renderers/color';
import {
    createColorVariantCssVariableSetter,
    getColorVariantNames,
} from '~/common/utils/color';
import { setCookie } from '~/common/utils/cookie';
import { setFaviconColor } from '~/common/utils/favicon';
import { setThemeColor } from '~/common/utils/meta';
import { getRendererManager } from '~/common/utils/rendererManager';
import type { UnregisterObserverCallback } from '~/common/utils/subject';

function useColorEffects(): void {
    useHandleUnknownColorSchemeEffect();
    useSynchronizeColorSchemeCookieEffect();
    useSynchronizeColorVariantSubjectsByNameAnimationEffect();
    useSynchronizeColorVariantSubjectsByNameObserversEffect();
    useSynchronizeMediaQueryPrefersColorSchemeEffect();
}

function useHandleUnknownColorSchemeEffect(): void {
    const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom);

    useEffect(() => {
        if (colorScheme === 'unknown') {
            setColorScheme(
                window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light',
            );
        }
    }, [setColorScheme, colorScheme]);
}

function useSynchronizeColorSchemeCookieEffect(): void {
    const colorScheme = useAtomValue(colorSchemeAtom);

    useEffect(() => {
        setCookie('colorScheme', colorScheme);
    }, [colorScheme]);
}

function useSynchronizeColorVariantSubjectsByNameAnimationEffect(): void {
    const rendererManager = getRendererManager();
    const colorScheme = useAtomValue(colorSchemeAtom);
    const previousColorSchemeRef = useRef(colorScheme);
    const colorVariantSubjectsByName = useAtomValue(
        colorVariantSubjectsByNameAtom,
    );
    const techName = useAtomValue(techNameAtom);
    const previousTechNameRef = useRef(techName);

    useEffect(() => {
        const previousColorScheme = previousColorSchemeRef.current;
        previousColorSchemeRef.current = colorScheme;
        const previousTechName = previousTechNameRef.current;
        previousTechNameRef.current = techName;
        const renderer = createColorVariantSubjectsByNameTransitionRenderer({
            animationDuration: 800,
            colorVariantSubjectsByName,
            newColorScheme: colorScheme,
            newTechName: techName,
            previousColorScheme,
            previousTechName,
        });

        return rendererManager.registerRenderer(renderer);
    }, [rendererManager, colorScheme, colorVariantSubjectsByName, techName]);
}

function useSynchronizeColorVariantSubjectsByNameObserversEffect(): void {
    const colorVariantSubjectsByName = useAtomValue(
        colorVariantSubjectsByNameAtom,
    );

    useEffect(() => {
        const colorVariantNames = getColorVariantNames();
        const unregisterObserverCallbacks: Array<UnregisterObserverCallback> =
            [];

        for (const colorVariantName of colorVariantNames) {
            const colorVariantSubject =
                colorVariantSubjectsByName[colorVariantName];
            const setColorVariantCssVariable =
                createColorVariantCssVariableSetter(colorVariantName);

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
            for (const unregisterObserver of unregisterObserverCallbacks.toReversed()) {
                unregisterObserver();
            }
        };
    }, [colorVariantSubjectsByName]);
}

function useSynchronizeMediaQueryPrefersColorSchemeEffect(): void {
    const setColorScheme = useSetAtom(colorSchemeAtom);
    const handleMediaQueryPrefersColorSchemeChange = useCallback(
        ({ matches }: MediaQueryListEvent) => {
            setColorScheme(matches ? 'dark' : 'light');
        },
        [setColorScheme],
    );

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            '(prefers-color-scheme: dark)',
        );

        mediaQueryList.addEventListener(
            'change',
            handleMediaQueryPrefersColorSchemeChange,
        );

        return () =>
            mediaQueryList.removeEventListener(
                'change',
                handleMediaQueryPrefersColorSchemeChange,
            );
    }, [setColorScheme, handleMediaQueryPrefersColorSchemeChange]);
}

export { useColorEffects };
