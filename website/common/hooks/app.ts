import { useEffect } from 'react';

export function useEffects() {
    useEffect(() => {
        document.body.classList.remove('no-transition');
    }, []);
}
