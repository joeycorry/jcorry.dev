import type { MutableRefObject } from 'react';

import type { UnregisterObserverCallback } from '~/common/utils/subject';

type Observer<T> = (value: T) => void;

const emptyValueSymbol = Symbol('emptyValue');

export class Subject<T> implements MutableRefObject<T> {
    #observers: Array<Observer<T>> = [];
    #value: T | typeof emptyValueSymbol;

    public constructor(value?: T) {
        this.#value = arguments.length > 0 ? value! : emptyValueSymbol;
    }

    public get current(): T {
        if (this.#value === emptyValueSymbol) {
            throw new Error('Subject has no value');
        }

        return this.#value;
    }

    public static mapAll<T extends unknown[], U>(
        subjects: { [K in keyof T]: Subject<T[K]> },
        mapper: (...values: [] | { [K in keyof T]: T[K] }) => U,
    ): [Subject<U>, UnregisterObserverCallback] {
        const [combinedSubject, unregisterCombinedObserver] =
            Subject.#combine<T>(...subjects);
        const [mappedSubject, unregisterMappedObserver] = combinedSubject.map(
            (...args) => (args.length === 0 ? mapper() : mapper(...args[0]!)),
        );
        const unregisterObservers = () => {
            unregisterCombinedObserver();
            unregisterMappedObserver();
        };

        return [mappedSubject, unregisterObservers];
    }

    public map<U>(
        mapper: (value?: T) => U,
    ): [Subject<U>, UnregisterObserverCallback] {
        const subject = new Subject(
            this.#value === emptyValueSymbol ? mapper() : mapper(this.#value),
        );

        const unregisterParentObserver = this.registerObserver(value =>
            subject.set(mapper(value)),
        );

        return [subject, unregisterParentObserver];
    }

    public registerObserver(observer: Observer<T>): UnregisterObserverCallback {
        this.#observers.push(observer);

        if (this.#value !== emptyValueSymbol) {
            observer(this.#value);
        }

        return () => this.#unregisterObserver(observer);
    }

    public set(newValue: T) {
        this.#value = newValue;

        for (const observer of this.#observers) {
            observer(this.#value);
        }
    }

    static #combine<T extends unknown[]>(
        ...subjects: { [K in keyof T]: Subject<T[K]> }
    ): [Subject<{ [K in keyof T]: T[K] }>, UnregisterObserverCallback] {
        const combinedValue = Array(subjects.length).fill(emptyValueSymbol) as {
            [K in keyof T]: T[K] | typeof emptyValueSymbol;
        };
        const combinedSubject = new Subject<{ [K in keyof T]: T[K] }>();

        const unregisterParentObserverCallbacks = subjects.map(
            (subject, index) =>
                subject.registerObserver(value => {
                    combinedValue[index] = value;

                    if (
                        combinedValue.every(value => value !== emptyValueSymbol)
                    ) {
                        combinedSubject.set(
                            combinedValue as { [K in keyof T]: T[K] },
                        );
                    }
                }),
        );
        const unregisterParentObservers = () => {
            for (const unregisterParentObserver of unregisterParentObserverCallbacks) {
                unregisterParentObserver();
            }
        };

        return [combinedSubject, unregisterParentObservers];
    }

    #unregisterObserver(observer: Observer<T>) {
        const index = this.#observers.indexOf(observer);

        if (index !== -1) {
            this.#observers.splice(index, 1);
        }
    }
}
