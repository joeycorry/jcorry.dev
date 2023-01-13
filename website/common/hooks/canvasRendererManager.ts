import CanvasRendererManager from 'common/lib/canvasRendererManager';
import { RefObject, useEffect } from 'react';

type UseEffectsParameter = {
    canvasElementRef: RefObject<HTMLCanvasElement>;
};

export function useEffects({ canvasElementRef }: UseEffectsParameter) {
    useEffect(() => {
        const maybeCanvasElement = canvasElementRef.current;

        if (maybeCanvasElement === null) {
            return;
        }

        const canvasRendererManager =
            CanvasRendererManager.getForCanvasElement(maybeCanvasElement);

        canvasRendererManager.onCanvasElementMount();

        return () =>
            canvasRendererManager.onCanvasElementUnmount(maybeCanvasElement);
    }, [canvasElementRef]);
}
