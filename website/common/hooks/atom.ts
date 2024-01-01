import type { WritableAtom } from 'jotai';
import { useSetAtom } from 'jotai';

function useNoArgumentSetAtom<
    Value,
    Result extends void | Promise<void> = void,
>(baseAtom: WritableAtom<Value, [undefined], Result>): () => void {
    return useSetAtom(baseAtom) as unknown as () => void;
}

export { useNoArgumentSetAtom };
