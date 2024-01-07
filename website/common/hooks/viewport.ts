import { useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { viewportAtom } from '~/common/atoms/viewport';
import {
    createDebouncedFunction,
    createThrottledFunction,
} from '~/common/utils/function';

import { useNoArgumentSetAtom } from './atom';

function useSynchronizeMediaQueryResolutionEffect(): void {
    const handleMediaQueryResolutionChange = useSynchronizeViewport();
    const devicePixelRatio =
        typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            `(resolution: ${devicePixelRatio}dppx)`,
        );

        mediaQueryList.addEventListener(
            'change',
            handleMediaQueryResolutionChange,
        );

        return () =>
            mediaQueryList.removeEventListener(
                'change',
                handleMediaQueryResolutionChange,
            );
    }, [handleMediaQueryResolutionChange, devicePixelRatio]);
}

function useSetViewportAndShowBackground(): () => void {
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const setViewport = useNoArgumentSetAtom(viewportAtom);

    return useMemo(
        () =>
            createDebouncedFunction({
                callback() {
                    setViewport();
                    setBackgroundIsVisible(true);
                },
                milliseconds: 400,
            }),
        [setBackgroundIsVisible, setViewport],
    );
}

function useSynchronizeViewport(): () => void {
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const setViewportAndShowBackground = useSetViewportAndShowBackground();

    return useMemo(
        () =>
            createThrottledFunction({
                callback() {
                    setBackgroundIsVisible(false);
                    setViewportAndShowBackground();
                },
            }),
        [setBackgroundIsVisible, setViewportAndShowBackground],
    );
}

function useSynchronizeResizeEffect(): void {
    const handleResize = useSynchronizeViewport();

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
}

function useViewportEffects(): void {
    useSynchronizeMediaQueryResolutionEffect();
    useSynchronizeResizeEffect();
}

export { useViewportEffects };
