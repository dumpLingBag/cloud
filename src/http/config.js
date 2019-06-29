let baseUrl = ''

switch (process.env.NODE_ENV) {
  case 'development':
    baseUrl = 'http://localhost:9090/' // 开发环境url
    break
  case 'cloud': // 注意这里的名字要和步骤二中设置的环境名字对应起来
    baseUrl = 'http://localhost:9090/' // 测试环境中的url
    break
  case 'production':
    baseUrl = 'https://cloud.rngay.cn/' // 生产环境url
    break
}

let config = {
  method: 'get',
  // 基础url前缀
  baseUrl: baseUrl,
  // 请求头信息
  header: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 5000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json'
}

export default config
