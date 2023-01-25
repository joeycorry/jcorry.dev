import * as AtomUtils from 'common/utils/atom';

const getViewportValue = import.meta.env.SSR
    ? () => ({ devicePixelRatio: 1, width: 0, height: 0 })
    : () => ({
          devicePixelRatio: window.devicePixelRatio,
          width: window.innerWidth,
          height: window.innerHeight,
      });

export const viewportAtom = AtomUtils.atomWithNoArgumentSetter(
    getViewportValue(),
    getViewportValue
);

viewportAtom.debugLabel = 'viewportAtom';
