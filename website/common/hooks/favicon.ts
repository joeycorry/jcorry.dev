import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { techNameAtom } from '~/common/atoms/techName';
import { setFavicon } from '~/common/utils/favicon';

export function useFaviconEffects() {
    const techName = useAtomValue(techNameAtom);

    useEffect(() => {
        setFavicon({ techName });
    }, [techName]);
}
