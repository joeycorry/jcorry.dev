import { atomWithNoArgumentSetter } from '~/common/utils/atom';
import type { Viewport } from '~/common/utils/viewport';

const getViewportValue = import.meta.env.SSR
    ? () => ({ devicePixelRatio: 1, width: 0, height: 0 })
    : () => ({
          devicePixelRatio: window.devicePixelRatio,
          width: window.innerWidth,
          height: window.innerHeight,
      });

const viewportAtom = atomWithNoArgumentSetter<Viewport>(
    getViewportValue(),
    getViewportValue,
);

viewportAtom.debugLabel = 'viewportAtom';

export { viewportAtom };
