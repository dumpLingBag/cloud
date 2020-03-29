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
        url: '',
        method: 'GET',
        params: data
    })
};

export default {request, dict}
