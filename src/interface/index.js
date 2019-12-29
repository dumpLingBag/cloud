import axios from '@/http/api'

const request = (url, method, data) => {
  return axios({
    url: url,
    method: method ? method : 'get',
    data: data || {}
  })
}

export default { request }
