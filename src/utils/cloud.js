const pasArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','_','-','$','%','&','@','+','!'];

export default class cloud {

    // 获取字典标签
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

    static password(pasLen) {
        if (pasLen && pasLen > 0) {
            let password = '';
            let pasArrLen = pasArr.length;
            for (let i = 0; i < pasLen; i++) {
                let x = Math.floor(Math.random() * pasArrLen);
                password += pasArr[x];
            }
            return password
        }
    }

    static httpData(data) {
        let obj = {};
        Object.keys(data).forEach(key => {
            if (key === 'search') {
                let d = data[key];
                Object.keys(d).forEach(k => {
                    obj[k] = d[k]
                })
            } else {
                obj[key] = data[key]
            }
        });
        return obj
    }

}