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
    setFaviconColor,
    setThemeColor,
} from '~/common/utils/color';
import { removeCookie, setCookie } from '~/common/utils/cookie';
import { evauluateNoop } from '~/common/utils/function';
import type { UnregisterObserver } from '~/common/utils/subject';

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
    const colorVariantSubjectsByName = useAtomValue(
        colorVariantSubjectsByNameAtom
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
            colorVariantSubjectsByName
                ? (() => {
                      const previousColorScheme =
                          previousColorSchemeRef.current;
                      previousColorSchemeRef.current = colorScheme;
                      const previousTechName = previousTechNameRef.current;
                      previousTechNameRef.current = techName;
                      const colorVariantSubjectsByNameTransitionRenderer =
                          createColorVariantSubjectsByNameTransitionRenderer({
                              animationDuration: 400,
                              colorVariantSubjectsByName,
                              newColorScheme: colorScheme,
                              newTechName: techName,
                              previousColorScheme,
                              previousTechName,
                          });

                      rendererManager.addRenderer(
                          colorVariantSubjectsByNameTransitionRenderer
                      );

                      return () => {
                          rendererManager.removeRenderer(
                              colorVariantSubjectsByNameTransitionRenderer
                          );
                      };
                  })()
                : evauluateNoop(),
        [rendererManager, colorScheme, colorVariantSubjectsByName, techName]
    );

    useEffect(
        () =>
            colorVariantSubjectsByName
                ? (() => {
                      const colorVariantNames = getColorVariantNames();
                      const unregisterObserverCallbacks: Array<UnregisterObserver> =
                          [];

                      for (const colorVariantName of colorVariantNames) {
                          const colorVariantSubject =
                              colorVariantSubjectsByName[colorVariantName];
                          const setColorVariantCssVariable =
                              createColorVariantCssVariableSetter({
                                  colorVariantName,
                              });

                          unregisterObserverCallbacks.push(
                              colorVariantSubject.register(
                                  setColorVariantCssVariable
                              )
                          );
                      }

                      const secondaryColorSubject =
                          colorVariantSubjectsByName.secondaryColor;

                      unregisterObserverCallbacks.push(
                          secondaryColorSubject.register(setFaviconColor)
                      );
                      unregisterObserverCallbacks.push(
                          secondaryColorSubject.register(setThemeColor)
                      );

                      return () => {
                          for (const unregisterObserver of unregisterObserverCallbacks) {
                              unregisterObserver();
                          }
                      };
                  })()
                : evauluateNoop(),
        [colorVariantSubjectsByName]
    );
}
