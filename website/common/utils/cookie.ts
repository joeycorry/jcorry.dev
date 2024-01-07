import type { ConvertibleToString } from './formatting';

const cookieMaxAge = 31536000;

function getCookieInBrowser(key: ConvertibleToString): string | null {
    const keyString = key.toString();
    const serializedValue = window.document.cookie
        ?.split(/;\s*/)
        ?.find(keyValue => keyValue.startsWith(keyString.toString()))
        ?.substring(keyString.length + 1);

    if (serializedValue !== undefined) {
        return serializedValue;
    }

    return null;
}

function removeCookie(key: ConvertibleToString): void {
    window.document.cookie = `${key.toString()}=; max-age=0`;
}

function setCookie(key: ConvertibleToString, value: ConvertibleToString): void {
    window.document.cookie = `${key.toString()}=${value.toString()}; max-age=${cookieMaxAge}`;
}

export { cookieMaxAge, getCookieInBrowser, removeCookie, setCookie };
