import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

import {
    colorSchemeAtom,
    colorVariantsByNameSubjectAtom,
} from '~/common/atoms/color';
import { techNameAtom } from '~/common/atoms/techName';
import { getRendererManager } from '~/common/lib/rendererManager';
import { createColorTransitionRenderer } from '~/common/renderers/color';
import {
    setColorVariantCssVariables,
    setFaviconColor,
    setThemeColor,
} from '~/common/utils/color';
import { removeCookie, setCookie } from '~/common/utils/cookie';
import { evauluateNoop } from '~/common/utils/function';

export function useMediaQueryListChangeHandler() {
    const setColorScheme = useSetAtom(colorSchemeAtom);

    return useCallback(
        ({ matches }: MediaQueryListEvent) => {
            setColorScheme(matches ? 'dark' : 'light');
        },
        [setColorScheme]
    );
}

export function useColorEffects() {
    const rendererManager = getRendererManager();
    const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom);
    const previousColorSchemeRef = useRef(colorScheme);
    const colorVariantsByNameSubject = useAtomValue(
        colorVariantsByNameSubjectAtom
    );
    const techName = useAtomValue(techNameAtom);
    const previousTechNameRef = useRef(techName);
    const handleMediaQueryListChange = useMediaQueryListChangeHandler();

    useEffect(() => {
        if (colorScheme === 'normal') {
            setColorScheme(
                window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light'
            );
        }
    }, [setColorScheme, colorScheme]);

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
    }, [setColorScheme, handleMediaQueryListChange]);

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

    useEffect(
        () =>
            colorVariantsByNameSubject
                ? (() => {
                      const previousColorScheme =
                          previousColorSchemeRef.current;
                      previousColorSchemeRef.current = colorScheme;
                      const previousTechName = previousTechNameRef.current;
                      previousTechNameRef.current = techName;
                      const colorTransitionRenderer =
                          createColorTransitionRenderer({
                              animationDuration: 400,
                              colorVariantsByNameSubject,
                              newColorScheme: colorScheme,
                              newTechName: techName,
                              previousColorScheme,
                              previousTechName,
                          });

                      rendererManager.addRenderer(colorTransitionRenderer);

                      return () => {
                          rendererManager.removeRenderer(
                              colorTransitionRenderer
                          );
                      };
                  })()
                : evauluateNoop(),
        [rendererManager, colorScheme, colorVariantsByNameSubject, techName]
    );

    useEffect(
        () =>
            colorVariantsByNameSubject
                ? (() => {
                      colorVariantsByNameSubject.register(
                          setColorVariantCssVariables
                      );
                      colorVariantsByNameSubject.register(setFaviconColor);
                      colorVariantsByNameSubject.register(setThemeColor);

                      return () => {
                          colorVariantsByNameSubject.unregister(
                              setColorVariantCssVariables
                          );
                          colorVariantsByNameSubject.unregister(
                              setFaviconColor
                          );
                          colorVariantsByNameSubject.unregister(setThemeColor);
                      };
                  })()
                : evauluateNoop(),
        [colorVariantsByNameSubject]
    );
}
