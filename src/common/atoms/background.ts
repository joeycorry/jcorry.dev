import { atom } from 'jotai';

const backgroundIsVisibleAtom = atom(true);

backgroundIsVisibleAtom.debugLabel = 'backgroundIsVisibleAtom';

export { backgroundIsVisibleAtom };
