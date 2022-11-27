const symbolsToEncode = ['[',']','\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];
const symbolsToEncodeSet = new Set(symbolsToEncode);

export const encodeSymbols = (str?: string) => {
    if (str) {
        let result = [];
        for (let char of str) {
            if (symbolsToEncodeSet.has(char)) {
                result.push('\\' + char);
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }
    return str;
}