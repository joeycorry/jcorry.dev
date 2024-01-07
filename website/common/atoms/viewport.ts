import { atom, type WritableAtom } from 'jotai';

import type { Viewport } from '~/common/utils/viewport';
import { createViewport } from '~/common/utils/viewport';

const viewportAtom: WritableAtom<Viewport, [undefined], void> = atom(
    createViewport(),
    (_, set) =>
        set(
            viewportAtom as unknown as WritableAtom<Viewport, [Viewport], void>,
            createViewport(),
        ),
);

viewportAtom.debugLabel = 'viewportAtom';

export { viewportAtom };
