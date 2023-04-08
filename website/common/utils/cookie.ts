type CreateCookiesAccessorsParameter = {
    getCookies: () => string | undefined;
    setCookies: (cookies: string) => void;
};

export function createCookiesValueAccessors({
    getCookies,
    setCookies,
}: CreateCookiesAccessorsParameter) {
    return {
        get: (key: string) => getCookie({ getCookies, key }),
        set: (key: string, value: string) =>
            setCookie({ key, setCookies, value }),
        remove: (key: string) => removeCookie({ key, setCookies }),
    };
}

type GetCookieParameter = {
    getCookies: () => string | undefined;
    key: string;
};

export function getCookie({ getCookies, key }: GetCookieParameter) {
    const serializedValue = getCookies()
        ?.split(/;\s*/)
        ?.find(keyValue => keyValue.startsWith(key))
        ?.substring(key.length + 1);

    if (serializedValue !== undefined) {
        return serializedValue;
    }

    return null;
}

type SetCookieParameter = {
    key: string;
    value: string;
    setCookies: (cookie: string) => void;
};

export function setCookie({ key, setCookies, value }: SetCookieParameter) {
    setCookies(`${key}=${value}; max-age=31536000`);
}

type RemoveCookieParameter = {
    key: string;
    setCookies: (cookie: string) => void;
};

export function removeCookie({ key, setCookies }: RemoveCookieParameter) {
    setCookies(`${key}=; max-age=0`);
}
