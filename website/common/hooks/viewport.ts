import { backgroundIsVisibleAtom } from 'common/atoms/background';
import { viewportAtom } from 'common/atoms/viewport';
import * as FunctionalUtils from 'common/utils/functional';
import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import * as AtomHooks from './atom';

function useDebouncedSetViewport() {
    const setViewport = AtomHooks.useNoArgumentSetAtom(viewportAtom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        FunctionalUtils.debounce(setViewport, { milliseconds: 400 }),
        [setViewport]
    );
}

function useViewportResizeListener() {
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
    const resizeListener = useViewportResizeListener();

    useEffect(() => {
        window.addEventListener('resize', resizeListener);

        return () => window.removeEventListener('resize', resizeListener);
    }, [resizeListener]);
}
