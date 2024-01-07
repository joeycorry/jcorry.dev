import type { WritableAtom } from 'jotai';
import { useSetAtom } from 'jotai';

type NoArgumentSetter = () => void;

function useNoArgumentSetAtom<
    Value,
    Result extends void | Promise<void> = void,
>(baseAtom: WritableAtom<Value, [undefined], Result>): NoArgumentSetter {
    return useSetAtom(baseAtom) as unknown as () => void;
}

export { useNoArgumentSetAtom };
