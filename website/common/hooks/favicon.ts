import { colorAtom } from 'common/atoms/color';
import * as FaviconUtils from 'common/utils/favicon';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

export function useEffects() {
    const color = useAtomValue(colorAtom);

    useEffect(() => FaviconUtils.setFavicon({ color }), [color]);
}
