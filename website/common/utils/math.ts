export function modulo(first: number, second: number) {
    return ((first % second) + second) % second;
}