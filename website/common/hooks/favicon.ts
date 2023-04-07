import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { colorAtom } from '~/common/atoms/color';
import * as FaviconUtils from '~/common/utils/favicon';

export function useEffects() {
    const color = useAtomValue(colorAtom);

    useEffect(() => FaviconUtils.setFavicon({ color }), [color]);
}
