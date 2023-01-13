type CreateCookieAccessorsParameter = {
    getCookie: () => string | undefined;
    setCookie: (cookie: string) => void;
};

export function createCookieItemAccessors({
    getCookie,
    setCookie,
}: CreateCookieAccessorsParameter) {
    return {
        getItem: (key: string) => getItem({ getCookie, key }),
        setItem: (key: string, value: string) =>
            setItem({ key, setCookie, value }),
        removeItem: (key: string) => removeItem({ key, setCookie }),
    };
}

type GetItemParameter = { getCookie: () => string | undefined; key: string };

export function getItem({ getCookie, key }: GetItemParameter) {
    const serializedValue = getCookie()
        ?.split(/;\s*/)
        ?.find(keyValue => keyValue.startsWith(key))
        ?.substring(key.length + 1);

    if (serializedValue !== undefined) {
        return serializedValue;
    }

    return null;
}

type SetItemParameter = {
    key: string;
    value: string;
    setCookie: (cookie: string) => void;
};

export function setItem({ key, setCookie, value }: SetItemParameter) {
    setCookie(`${key}=${value}; max-age=31536000`);
}

type RemoveItemParameter = { key: string; setCookie: (cookie: string) => void };

export function removeItem({ key, setCookie }: RemoveItemParameter) {
    setCookie(`${key}=; max-age=0`);
}
