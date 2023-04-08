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

function useViewportChangeHandler() {
    const debouncedSetViewport = useDebouncedSetViewport();
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        throttleFunction(() => {
            setBackgroundIsVisible(false);
            debouncedSetViewport();
        }),
        [debouncedSetViewport, setBackgroundIsVisible]
    );
}

export function useViewportEffects() {
    const handleViewportChange = useViewportChangeHandler();
    const devicePixelRatio =
        typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    useEffect(() => {
        window.addEventListener('resize', handleViewportChange);

        return () => window.removeEventListener('resize', handleViewportChange);
    }, [handleViewportChange]);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            `(resolution: ${devicePixelRatio}dppx)`
        );

        mediaQueryList.addEventListener('change', handleViewportChange);

        return () =>
            mediaQueryList.removeEventListener('change', handleViewportChange);
    }, [handleViewportChange, devicePixelRatio]);
}
