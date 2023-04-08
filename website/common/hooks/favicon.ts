import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { colorAtom } from '~/common/atoms/color';
import { setFavicon } from '~/common/utils/favicon';

export function useFaviconEffects() {
    const color = useAtomValue(colorAtom);

    useEffect(() => {
        setFavicon({ color });
    }, [color]);
}
