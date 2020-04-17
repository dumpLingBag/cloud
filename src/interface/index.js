import axios from '@/http/api'
import url from '@/interface/url'
import methods from "./method";

const request = (url, method, data) => {
    if (method && method === methods.get) {
        return axios({
            url: url,
            method: method,
            params: data
        })
    }
    return axios({
        url: url,
        method: method,
        data: data || {}
    })
};

const download = (url, data) => {
    return axios({
        url: url,
        method: methods.post,
        data: data,
        responseType: "blob"
    }).then(res => {
        let fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1]);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([res.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"}));
        link.target = "_blank";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href); // 释放URL 对象
        document.body.removeChild(link);
    })
};

const upload = (url, data) => {
    return axios({
        url: url,
        method: methods.post,
        data: data,
        headers: { "Content-Type": "multipart/form-data" }
    })
};

const dict = (data) => {
    return axios({
        url: url.DictData.listDictData,
        method: methods.get,
        params: {'dictType': data}
    })
};

export default {request, dict, download, upload}
