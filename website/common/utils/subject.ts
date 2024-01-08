import { Subject } from '~/common/lib/subject';

type CombinedSubject<T extends readonly unknown[]> = Subject<{
    [K in keyof T]: T[K];
}>;

type CombinedSubjectAndUnregisterObserverCallback<
    T extends readonly unknown[],
> = [CombinedSubject<T>, UnregisterObserverCallback];

type SubjectAndUnregisterObserverCallback<T> = [
    Subject<T>,
    UnregisterObserverCallback,
];

type Subjects<T extends readonly unknown[]> = {
    [K in keyof T]: Subject<T[K]>;
};

type UnregisterObserverCallback = () => void;

type ValueOrSubject<T> = T | Subject<T>;

function combineSubjects<const T extends readonly unknown[]>(
    subjects: Subjects<T>,
    options: { abortSignal: AbortSignal },
): CombinedSubject<T>;
function combineSubjects<const T extends readonly unknown[]>(
    subjects: Subjects<T>,
    options?: { abortSignal: undefined },
): CombinedSubjectAndUnregisterObserverCallback<T>;
function combineSubjects<const T extends readonly unknown[]>(
    subjects: Subjects<T>,
    { abortSignal }: { abortSignal?: AbortSignal } = {},
): CombinedSubject<T> | CombinedSubjectAndUnregisterObserverCallback<T> {
    const combinedValue = subjects.map(subject => subject.get()) as {
        [K in keyof T]: T[K];
    };
    const combinedSubject = new Subject(combinedValue);

    if (abortSignal) {
        for (const [index, subject] of subjects.entries()) {
            subject.registerObserver(
                value => {
                    const newValue = combinedSubject
                        .get()
                        .with(index, value) as {
                        [K in keyof T]: T[K];
                    };

                    combinedSubject.set(newValue);
                },
                { abortSignal },
            );
        }

        return combinedSubject;
    }

    const unregisterParentObserverCallbacks = subjects.map((subject, index) =>
        subject.registerObserver(value => {
            const newValue = combinedSubject.get().with(index, value) as {
                [K in keyof T]: T[K];
            };

            combinedSubject.set(newValue);
        }),
    );
    const unregisterParentObservers: UnregisterObserverCallback = () => {
        for (const unregisterObserver of unregisterParentObserverCallbacks) {
            unregisterObserver();
        }
    };

    return [combinedSubject, unregisterParentObservers];
}

function getSubjectValue<T>(valueOrSubject: ValueOrSubject<T>): T {
    return isSubject<T>(valueOrSubject) ? valueOrSubject.get() : valueOrSubject;
}

function isSubject<T>(thing: unknown): thing is Subject<T> {
    return (
        typeof thing === 'object' &&
        thing !== null &&
        'get' in thing &&
        typeof thing.get === 'function'
    );
}

function mapSubjects<const T extends readonly unknown[], U>(
    subjects: [...Subjects<T>],
    mapper: (...values: [...T]) => U,
    options: { abortSignal: AbortSignal },
): Subject<U>;
function mapSubjects<const T extends readonly unknown[], U>(
    subjects: [...Subjects<T>],
    mapper: (...values: [...T]) => U,
    options?: { abortSignal: undefined },
): SubjectAndUnregisterObserverCallback<U>;
function mapSubjects<const T extends readonly unknown[], U>(
    subjects: [...Subjects<T>],
    mapper: (...values: [...T]) => U,
    { abortSignal }: { abortSignal?: AbortSignal } = {},
): Subject<U> | SubjectAndUnregisterObserverCallback<U> {
    if (abortSignal) {
        return combineSubjects(subjects, { abortSignal }).map(
            values => mapper(...values),
            { abortSignal },
        );
    }

    const [combinedSubject, unregisterCombinedObserver] =
        combineSubjects(subjects);
    const [mappedSubject, unregisterMappedObserver] = combinedSubject.map(
        values => mapper(...values),
    );
    const unregisterObservers: UnregisterObserverCallback = () => {
        unregisterCombinedObserver();
        unregisterMappedObserver();
    };

    return [mappedSubject, unregisterObservers];
}

export type {
    SubjectAndUnregisterObserverCallback,
    UnregisterObserverCallback,
    ValueOrSubject,
};
export { getSubjectValue, mapSubjects };
