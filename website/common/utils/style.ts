function setRootElementCssVariable(
    cssVariableName: string,
    cssValue: string,
): void {
    window.document.documentElement.style.setProperty(
        cssVariableName,
        cssValue,
    );
}

export { setRootElementCssVariable };
