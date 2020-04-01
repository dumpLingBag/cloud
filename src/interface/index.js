import axios from '@/http/api'
import url from '@/interface/url'

const request = (url, method, data) => {
    if (method && method === 'GET') {
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

const dict = (data) => {
    return axios({
        url: url.DictData.listDictData,
        method: 'GET',
        params: {'dictType': data}
    })
};

export default {request, dict}
