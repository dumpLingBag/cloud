const pasArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','_','-','$','%','&','@','+','!'];

/**
 * 驼峰转下划线
 * @param str
 * @returns {string}
 */
export function toLine(str) {
    if (str) {
        str = str.replace(str[0], str[0].toLowerCase());
        return str.replace(/([A-Z])/g, '-$1').toLowerCase()
    }
}

/**
 * 下划线转驼峰
 * @param str
 * @returns {*}
 */
export function toHump(str) {
    if (str) {
        str = str.replace(str[0], str[0].toUpperCase());
        return str.replace(/\_(\w)/g, function (all, letter) {
            return letter.toUpperCase()
        })
    }
}

/**
 * 返回时间
 * @param time
 * @returns {string}
 */
export function time (time) {
    let year = time.getFullYear()
    let month = time.getMonth() + 1 < 10 ? '0' + time.getMonth() : time.getMonth()
    let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()

    let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    let seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()

    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
}

/**
 * 处理后端返回的错误信息
 * @param res
 * @param error
 */
export function msg (res, error) {
    if (res && res.code === 1) {
        let result = JSON.parse(res.msg)
        Object.keys(result).forEach(key => {
            error[key] = result[key]
        })
    }
}

/**
 * 清除表单信息
 * @param form
 */
export function clearForm (form) {
    if (form) {
        Object.keys(form).forEach(key => {
            form[key] = ''
        })
    }
}

/**
 * 获取字典标签值
 * @param data 字典数据
 * @param value 要获取标签的值
 * @returns {string}
 */
export function getDictLabel(data, value) {
    let actions = '';
    Object.keys(data).map(key => {
        if (data[key].dictValue === String(value)) {
            actions = data[key].dictLabel;
            return actions
        }
    });
    return actions;
}

/**
 * 合并对象
 * @param obj1
 * @param obj2
 * @returns {*}
 */
export function objMerge(obj1, obj2) {
    Object.keys(obj2).map(key =>{
        obj1[key] = obj2[key]
    });
    return obj1;
}

/**
 * 获取对象的id集合
 * @param obj
 * @returns {[]}
 */
export function getIds(obj) {
    let array = [];
    Object.keys(obj).map(key => {
        array.push(obj[key].id)
    });
    return array;
}

/**
 * 生成随机密码
 * @param pasLen 要生成的密码长度
 * @returns {string}
 */
export function password(pasLen) {
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

/**
 * 合并请求的数据
 * @param data
 * @returns {{}}
 */
export function httpData(data) {
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
