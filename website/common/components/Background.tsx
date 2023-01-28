import { backgroundIsVisibleAtom } from 'common/atoms/background';
import * as BackgroundHooks from 'common/hooks/background';
import * as CanvasRendererManagerHooks from 'common/hooks/canvasRendererManager';
import { useAtomValue } from 'jotai';
import { memo, useRef } from 'react';

import styles from './Background.module.css';

function Background() {
    const isVisible = useAtomValue(backgroundIsVisibleAtom);
    const canvasElementRef = useRef<HTMLCanvasElement>(null);

    CanvasRendererManagerHooks.useEffects({ canvasElementRef });
    BackgroundHooks.useEffects({ canvasElementRef });

    return (
        <canvas
            ref={canvasElementRef}
            className={styles.background}
            data-is-visible={isVisible.toString()}
        />
    );
}

export default memo(Background);
