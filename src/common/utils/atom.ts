import type { Atom, WritableAtom } from 'jotai';

type AtomSetValueParameters<T> = T extends WritableAtom<
    unknown,
    infer Parameters,
    unknown
>
    ? Parameters
    : T extends Atom<infer Parameter>
      ? [Parameter]
      : never;

export type { AtomSetValueParameters };
