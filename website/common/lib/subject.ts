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
    ): SubjectAndUnregisterObserverCallback<U> {
        const subject = new Subject(mapper(this.#value));

        const unregisterParentObserver = this.registerObserver(value =>
            subject.set(mapper(value)),
        );

        return [subject, unregisterParentObserver];
    }

    public registerObserver(observer: Observer<T>): UnregisterObserverCallback {
        this.#observers.push(observer);
        observer(this.#value);

        return () => this.#unregisterObserver(observer);
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
