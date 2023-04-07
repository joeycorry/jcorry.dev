import * as JotaiUtils from '~/common/utils/jotai';

const getViewportValue = import.meta.env.SSR
    ? () => ({ devicePixelRatio: 1, width: 0, height: 0 })
    : () => ({
          devicePixelRatio: window.devicePixelRatio,
          width: window.innerWidth,
          height: window.innerHeight,
      });

export const viewportAtom = JotaiUtils.atomWithNoArgumentSetter(
    getViewportValue(),
    getViewportValue
);

viewportAtom.debugLabel = 'viewportAtom';
