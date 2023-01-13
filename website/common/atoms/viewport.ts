import * as AtomUtils from 'common/utils/atom';

const getViewportValue = import.meta.env.SSR
    ? () => ({ width: 0, height: 0 })
    : () => ({
          width: window.innerWidth,
          height: window.innerHeight,
      });

export const viewportAtom = AtomUtils.atomWithNoArgumentSetter(
    getViewportValue(),
    getViewportValue
);

viewportAtom.debugLabel = 'viewportAtom';
