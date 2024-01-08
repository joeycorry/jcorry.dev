function assertSignalIsNotAborted(abortSignal?: AbortSignal): void {
    if (abortSignal && abortSignal.aborted) {
        throw new Error(
            "`abortSignal`'s `AbortController` has already been aborted.",
        );
    }
}

export { assertSignalIsNotAborted };
