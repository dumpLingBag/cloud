import axios from '@/http/api'

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
}

export default { request }
