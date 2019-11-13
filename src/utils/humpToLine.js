export default class humpToLine {
    static line (str) {
        if (str) {
            str = str.replace(str[0], str[0].toLowerCase())
            return str.replace(/([A-Z])/g, '_$1').toLowerCase()
        }
    }
}