export default class humpToLine {
    static toLine (str) {
        if (str) {
            str = str.replace(str[0], str[0].toLowerCase());
            return str.replace(/([A-Z])/g, '_$1').toLowerCase()
        }
    }

    static toHump (str) {
        if (str) {
            str = str.replace(str[0], str[0].toUpperCase());
            return str.replace(/\_(\w)/g, function (all, letter) {
                return letter.toUpperCase()
            })
        }
    }
}