import { useEffect } from 'react';

import { techNameAtom } from '~/common/atoms/techName';

import { useNoArgumentSetAtom } from './atom';

function useContinuousTechNameAnimationEffect(): void {
    const setNextTechName = useNoArgumentSetAtom(techNameAtom);

    useEffect(() => {
        const intervalId = window.setInterval(() => setNextTechName(), 2500);

        return () => window.clearInterval(intervalId);
    }, [setNextTechName]);
}

function useTechNameEffects(): void {
    useContinuousTechNameAnimationEffect();
}

export { useTechNameEffects };
