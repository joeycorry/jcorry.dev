export async function getDelayedPromise(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
