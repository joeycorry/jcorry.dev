import { useEffect } from 'react';

export function useAppEffects() {
    useEffect(() => {
        document.body.classList.remove('no-transition');
    }, []);
}
