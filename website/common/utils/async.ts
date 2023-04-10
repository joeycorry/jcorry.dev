export async function getDelayedPromise(milliseconds: number) {
    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}
