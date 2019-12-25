import axios from '@/http/api'

export const httpGet = (url, method) => {
  return axios({
    url: url,
    method: method ? method : 'get'
  })
}

export const request = (url, method, data) => {
  return axios({
    url: url,
    method: method ? method : 'get',
    data: data || {}
  })
}

export default { httpGet, request }
