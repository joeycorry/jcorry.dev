import { useSetAtom, WritableAtom } from 'jotai';

export function useNoArgumentSetAtom<
    Value,
    Result extends void | Promise<void> = void
>(baseAtom: WritableAtom<Value, undefined, Result>) {
    return useSetAtom(baseAtom) as () => void;
}
