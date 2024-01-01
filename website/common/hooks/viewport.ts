import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { viewportAtom } from '~/common/atoms/viewport';
import { debounceFunction, throttleFunction } from '~/common/utils/function';

import { useNoArgumentSetAtom } from './atom';

function useDebouncedSetViewport() {
    const setViewport = useNoArgumentSetAtom(viewportAtom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(debounceFunction(setViewport, { milliseconds: 400 }), [
        setViewport,
    ]);
}

function useViewportEffects() {
    const handleWindowResizeOrMediaQueryListResolutionChange =
        useWindowResizeOrMediaQueryListResolutionChangeHandler();
    const devicePixelRatio =
        typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    useEffect(() => {
        window.addEventListener(
            'resize',
            handleWindowResizeOrMediaQueryListResolutionChange,
        );

        return () =>
            window.removeEventListener(
                'resize',
                handleWindowResizeOrMediaQueryListResolutionChange,
            );
    }, [handleWindowResizeOrMediaQueryListResolutionChange]);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            `(resolution: ${devicePixelRatio}dppx)`,
        );

        mediaQueryList.addEventListener(
            'change',
            handleWindowResizeOrMediaQueryListResolutionChange,
        );

        return () =>
            mediaQueryList.removeEventListener(
                'change',
                handleWindowResizeOrMediaQueryListResolutionChange,
            );
    }, [handleWindowResizeOrMediaQueryListResolutionChange, devicePixelRatio]);
}

function useWindowResizeOrMediaQueryListResolutionChangeHandler() {
    const debouncedSetViewport = useDebouncedSetViewport();
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        throttleFunction(() => {
            setBackgroundIsVisible(false);
            debouncedSetViewport();
        }),
        [debouncedSetViewport, setBackgroundIsVisible],
    );
}

export { useViewportEffects };
