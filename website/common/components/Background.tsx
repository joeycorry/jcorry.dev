import { useAtomValue } from 'jotai';
import { memo, useRef } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { useBackgroundEffects } from '~/common/hooks/background';
import { useRendererManagerEffects } from '~/common/hooks/rendererManager';
import styles from '~/common/styles/Background.module.css';

const Background = memo(UnmemoizedBackground);

function UnmemoizedBackground() {
    const backgroundIsVisible = useAtomValue(backgroundIsVisibleAtom);
    const canvasElementRef = useRef<HTMLCanvasElement>(null);

    useRendererManagerEffects();
    useBackgroundEffects({ canvasElementRef });

    return (
        <canvas
            ref={canvasElementRef}
            id="background"
            className={styles.background}
            data-is-visible={backgroundIsVisible.toString()}
        />
    );
}

export { Background };
