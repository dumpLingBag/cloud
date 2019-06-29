import axios from '@/http/api'

export const httpGet = (url) => {
  return axios({
    url: url,
    method: 'get'
  })
}

export const httpPost = (url, data) => {
  return axios({
    url: url,
    method: 'post',
    data: data || {}
  })
}

export default { httpGet, httpPost }
