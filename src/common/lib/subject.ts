import { assertSignalIsNotAborted } from '~/common/utils/aborting';
import type {
    SubjectAndUnregisterObserverCallback,
    UnregisterObserverCallback,
} from '~/common/utils/subject';

type Observer<T> = (value: T) => void;

class Subject<T> {
    #observers: Array<Observer<T>> = [];
    #value: T;

    public constructor(value: T) {
        this.#value = value;
    }

    public get(): T {
        return this.#value;
    }

    public map<U>(
        mapper: (value: T) => U,
        options?: { abortSignal: undefined },
    ): SubjectAndUnregisterObserverCallback<U>;
    public map<U>(
        mapper: (value: T) => U,
        options: { abortSignal: AbortSignal },
    ): Subject<U>;
    public map<U>(
        mapper: (value: T) => U,
        { abortSignal }: { abortSignal?: AbortSignal } = {},
    ): SubjectAndUnregisterObserverCallback<U> | Subject<U> {
        assertSignalIsNotAborted(abortSignal);

        const subject = new Subject(mapper(this.#value));

        if (!abortSignal) {
            return [
                subject,
                this.registerObserver(value => subject.set(mapper(value))),
            ];
        }

        this.registerObserver(value => subject.set(mapper(value)), {
            abortSignal,
        });

        return subject;
    }

    public registerObserver(
        observer: Observer<T>,
        options?: { abortSignal: undefined },
    ): UnregisterObserverCallback;
    public registerObserver(
        observer: Observer<T>,
        options: { abortSignal: AbortSignal },
    ): void;
    public registerObserver(
        observer: Observer<T>,
        { abortSignal }: { abortSignal?: AbortSignal } = {},
    ): UnregisterObserverCallback | void {
        assertSignalIsNotAborted(abortSignal);

        this.#observers.push(observer);
        observer(this.#value);

        if (!abortSignal) {
            return () => this.#unregisterObserver(observer);
        }

        const unregister: UnregisterObserverCallback = () => {
            abortSignal.removeEventListener('abort', unregister);
            this.#unregisterObserver(observer);
        };

        abortSignal.addEventListener('abort', unregister);
    }

    public set(newValue: T): void {
        this.#value = newValue;

        for (const observer of this.#observers) {
            observer(this.#value);
        }
    }

    #unregisterObserver(observer: Observer<T>): void {
        this.#observers = this.#observers.filter(
            observer_ => observer !== observer_,
        );
    }
}

export { Subject };
