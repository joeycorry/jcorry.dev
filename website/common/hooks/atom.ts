import * as AtomUtils from 'common/utils/atom';
import { Atom, useSetAtom, WritableAtom } from 'jotai';
import * as JotaiUtils from 'jotai/utils';

export function useNoArgumentSetAtom<
    Value,
    Result extends void | Promise<void> = void
>(baseAtom: WritableAtom<Value, undefined, Result>) {
    return useSetAtom(baseAtom) as () => void;
}
