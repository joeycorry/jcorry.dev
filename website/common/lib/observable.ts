type Subscriber<T> = (value: T) => void;

const emptyValueSymbol = Symbol('emptyValue');

export class Observable<T> {
    #subscribers: Array<Subscriber<T>> = [];
    #value: T | typeof emptyValueSymbol;

    constructor(value?: T) {
        this.#value = arguments.length > 0 ? value! : emptyValueSymbol;
    }

    set(newValue: T) {
        this.#value = newValue;

        for (const subscriber of this.#subscribers) {
            subscriber(this.#value);
        }
    }

    subscribe(subscriber: Subscriber<T>) {
        this.#subscribers.push(subscriber);

        if (this.#value !== emptyValueSymbol) {
            subscriber(this.#value);
        }
    }

    unsubscribe(subscriber: Subscriber<T>) {
        const index = this.#subscribers.indexOf(subscriber);

        if (index !== -1) {
            this.#subscribers.splice(index, 1);
        }
    }
}
