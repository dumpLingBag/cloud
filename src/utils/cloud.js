export default class cloud {

    static getDictLabel(data, value) {
        let actions = '';
        Object.keys(data).map(key => {
            if (data[key].dictValue === String(value)) {
                actions = data[key].dictLabel;
                return actions
            }
        });
        return actions;
    }

    // 合并对象
    static objMerge(obj1, obj2) {
        Object.keys(obj2).map(key =>{
            obj1[key] = obj2[key]
        });
        return obj1;
    }

    // 获取 ids
    static getIds(obj) {
        let array = [];
        Object.keys(obj).map(key => {
            array.push(obj[key].id)
        });
        return array;
    }

}