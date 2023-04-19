import { useAtomValue } from 'jotai';
import { memo, useCallback } from 'react';
import { Pause, Play } from 'react-feather';

import { techNameAnimationShouldRepeatAtom } from '~/common/atoms/techName';
import { useNoArgumentSetAtom } from '~/common/hooks/atom';
import { useTechNameAnimationStarter } from '~/common/hooks/techName';

function usePlayPauseButtonClickHandler() {
    const startAnimation = useTechNameAnimationStarter();
    const techNameAnimationShouldRepeat = useAtomValue(
        techNameAnimationShouldRepeatAtom
    );
    const toggleTechNameAnimationShouldRepeat = useNoArgumentSetAtom(
        techNameAnimationShouldRepeatAtom
    );

    return useCallback(() => {
        if (!techNameAnimationShouldRepeat) {
            startAnimation();
        }

        toggleTechNameAnimationShouldRepeat();
    }, [
        startAnimation,
        techNameAnimationShouldRepeat,
        toggleTechNameAnimationShouldRepeat,
    ]);
}

function UnmemoizedPlayPauseButton() {
    const techNameAnimationShouldRepeat = useAtomValue(
        techNameAnimationShouldRepeatAtom
    );
    const handlePlayPauseButtonClick = usePlayPauseButtonClickHandler();
    const [title, Icon] = techNameAnimationShouldRepeat
        ? ['Pause Color Changes', Pause]
        : ['Initiate Color Changes', Play];

    return (
        <button title={title} onClick={handlePlayPauseButtonClick}>
            <Icon />
        </button>
    );
}

export const PlayPauseButton = memo(UnmemoizedPlayPauseButton);
