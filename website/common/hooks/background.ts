import { useAtomValue, useSetAtom } from 'jotai';
import type { RefObject } from 'react';
import { useEffect } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { colorVariantSubjectsByNameAtom } from '~/common/atoms/color';
import { viewportAtom } from '~/common/atoms/viewport';
import { setupBackgroundRenderer } from '~/common/renderers/background';
import { setBackgroundCanvasDimensions } from '~/common/utils/background';

function useBackgroundEffects({
    canvasElementRef,
}: {
    canvasElementRef: RefObject<HTMLCanvasElement>;
}) {
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const viewport = useAtomValue(viewportAtom);
    const colorVariantSubjectsByName = useAtomValue(
        colorVariantSubjectsByNameAtom,
    );

    useEffect(
        () => setBackgroundCanvasDimensions({ canvasElementRef, viewport }),
        [canvasElementRef, viewport],
    );

    useEffect(
        () =>
            setupBackgroundRenderer({
                canvasElementRef,
                colorVariantSubjectsByName,
                setBackgroundIsVisible,
                viewport,
            }),
        [
            canvasElementRef,
            colorVariantSubjectsByName,
            setBackgroundIsVisible,
            viewport,
        ],
    );
}

export { useBackgroundEffects };
