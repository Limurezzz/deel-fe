const symbolsToEscape = ['[',']','\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];
const symbolsToEscapeSet = new Set(symbolsToEscape);

export const escapeSymbols = (str?: string) => {
    if (str) {
        let result = [];
        for (let char of str) {
            if (symbolsToEscapeSet.has(char)) {
                result.push('\\' + char);
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }
    return str;
}