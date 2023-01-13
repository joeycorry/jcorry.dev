export type StringKeys<T> = Extract<keyof T, string>;

type _Tuple<T, N extends number, R extends T[]> = R['length'] extends N
    ? R
    : _Tuple<T, N, [T, ...R]>;

export type Tuple<T, N extends number> = N extends N
    ? number extends N
        ? T[]
        : _Tuple<T, N, []>
    : never;
