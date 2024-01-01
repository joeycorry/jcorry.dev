function createCookiesValueAccessors({
    getCookies,
    setCookies,
}: {
    getCookies: () => string | undefined;
    setCookies: (cookies: string) => void;
}) {
    return {
        get: (key: string) => getCookie({ getCookies, key }),
        set: (key: string, value: string) =>
            setCookie({ key, setCookies, value }),
        remove: (key: string) => removeCookie({ key, setCookies }),
    };
}

function getCookie({
    getCookies,
    key,
}: {
    getCookies: () => string | undefined;
    key: string;
}) {
    const serializedValue = getCookies()
        ?.split(/;\s*/)
        ?.find(keyValue => keyValue.startsWith(key))
        ?.substring(key.length + 1);

    if (serializedValue !== undefined) {
        return serializedValue;
    }

    return null;
}

function removeCookie({
    key,
    setCookies,
}: {
    key: string;
    setCookies: (cookie: string) => void;
}) {
    setCookies(`${key}=; max-age=0`);
}

function setCookie({
    key,
    setCookies,
    value,
}: {
    key: string;
    setCookies: (cookie: string) => void;
    value: string;
}) {
    setCookies(`${key}=${value}; max-age=31536000`);
}

export { createCookiesValueAccessors, getCookie, removeCookie, setCookie };
