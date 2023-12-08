import type { MutableRefObject } from 'react';

import type { UnregisterObserver } from '~/common/utils/subject';

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

    map<U>(mapper: (value?: T) => U) {
        const subject = new Subject(
            this.#value === emptyValueSymbol ? mapper() : mapper(this.#value)
        );

        this.register(value => subject.set(mapper(value)));

        return subject;
    }

    register(observer: Observer<T>): UnregisterObserver {
        this.#observers.push(observer);

        if (this.#value !== emptyValueSymbol) {
            observer(this.#value);
        }

        return () => this.#unregister(observer);
    }

    set(newValue: T) {
        this.#value = newValue;

        for (const observer of this.#observers) {
            observer(this.#value);
        }
    }

    #unregister(observer: Observer<T>) {
        const index = this.#observers.indexOf(observer);

        if (index !== -1) {
            this.#observers.splice(index, 1);
        }
    }
}
