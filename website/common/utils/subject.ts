import { Subject } from '~/common/lib/subject';

type SubjectAndUnregisterObserverCallback<T> = [
    Subject<T>,
    UnregisterObserverCallback,
];

type UnregisterObserverCallback = () => void;

type ValueOrSubject<T> = T | Subject<T>;

function combineSubjects<T extends unknown[]>(
    ...subjects: { [K in keyof T]: Subject<T[K]> }
): SubjectAndUnregisterObserverCallback<{ [K in keyof T]: T[K] }> {
    const combinedValue = subjects.map(subject => subject.get()) as {
        [K in keyof T]: T[K];
    };
    const combinedSubject = new Subject(combinedValue);
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
    subjects: [...{ [K in keyof T]: Subject<T[K]> }],
    mapper: (...values: [...T]) => U,
): SubjectAndUnregisterObserverCallback<U> {
    const [combinedSubject, unregisterParentObservers] = combineSubjects(
        ...subjects,
    );
    const [mappedSubject, unregisterMappedObserver] = combinedSubject.map(
        values => mapper(...values),
    );
    const unregisterObservers: UnregisterObserverCallback = () => {
        unregisterParentObservers();
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
