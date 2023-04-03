import { backgroundIsVisibleAtom } from 'common/atoms/background';
import { viewportAtom } from 'common/atoms/viewport';
import * as FunctionalUtils from 'common/utils/functional';
import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import * as JotaiHooks from './jotai';

function useDebouncedSetViewport() {
    const setViewport = JotaiHooks.useNoArgumentSetAtom(viewportAtom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        FunctionalUtils.debounce(setViewport, { milliseconds: 400 }),
        [setViewport]
    );
}

function useViewportChangeListener() {
    const debouncedSetViewport = useDebouncedSetViewport();
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        FunctionalUtils.throttle(() => {
            setBackgroundIsVisible(false);
            debouncedSetViewport();
        }),
        [debouncedSetViewport, setBackgroundIsVisible]
    );
}

export function useEffects() {
    const changeListener = useViewportChangeListener();
    const devicePixelRatio =
        typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    useEffect(() => {
        window.addEventListener('resize', changeListener);

        return () => window.removeEventListener('resize', changeListener);
    }, [changeListener]);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(
            `(resolution: ${devicePixelRatio}dppx)`
        );

        mediaQueryList.addEventListener('change', changeListener);

        return () =>
            mediaQueryList.removeEventListener('change', changeListener);
    }, [changeListener, devicePixelRatio]);
}
