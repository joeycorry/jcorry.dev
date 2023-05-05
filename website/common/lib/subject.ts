type Observer<T> = (value: T) => void;

const emptyValueSymbol = Symbol('emptyValue');

export class Subject<T> {
    #observers: Array<Observer<T>> = [];
    #value: T | typeof emptyValueSymbol;

    constructor(value?: T) {
        this.#value = arguments.length > 0 ? value! : emptyValueSymbol;
    }

    register(observer: Observer<T>) {
        this.#observers.push(observer);

        if (this.#value !== emptyValueSymbol) {
            observer(this.#value);
        }
    }

    set(newValue: T) {
        this.#value = newValue;

        for (const observer of this.#observers) {
            observer(this.#value);
        }
    }

    unregister(observer: Observer<T>) {
        const index = this.#observers.indexOf(observer);

        if (index !== -1) {
            this.#observers.splice(index, 1);
        }
    }
}
