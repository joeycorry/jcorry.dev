type ConvertibleToString = {
    toString(): string;
};

type KebabCase<
    T extends string,
    A extends string = '',
> = T extends `${infer F}${infer R}`
    ? KebabCase<R, `${A}${F extends Lowercase<F> ? '' : '-'}${Lowercase<F>}`>
    : A;

export type { ConvertibleToString, KebabCase };
