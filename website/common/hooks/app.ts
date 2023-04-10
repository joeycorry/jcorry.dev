import { useEffect } from 'react';

export function useAppEffects() {
    useEffect(() => {
        window.document.body.classList.remove('no-transition');
    }, []);
}
