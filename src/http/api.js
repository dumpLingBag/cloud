const axios = require('axios')
import config from '@/http/config'
import router from '@/router/router'
import NProgress from 'nprogress'
import { MessageBox, Message } from 'element-ui'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

export default function $axios (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: {},
      timeout: config.timeout,
      transformResponse: [function (data) {
        return data
      }]
    })

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        NProgress.start()
        let token = localStorage.token
        if (token) {
          config.headers.token = token
        } else {
          // 重定向到登录页
          router.push('/login')
          NProgress.done()
        }
        return config
      },
      error => {
        // 需要重定向到错误页
        const errorInfo = error.response
        if (errorInfo) {
          // error =errorInfo.data  //页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        NProgress.done()
        let data
        if (response.data) {
          data = JSON.parse(response.data)
        } else {
          // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
          data = JSON.parse(response.request.responseText)
        }

        // 根据返回的code值来做不同的处理
        switch (data.code) {
          case -1:
            Message.warning({
              message: data.msg,
              duration: 1500,
              showClose: false
            })
            break
          case 2:
            Message.warning({
              message: data.msg,
              duration: 1500,
              showClose: false
            })
            break
          case 0:
            // 正常的请求返回
            break
          case 401:
            MessageBox.alert(data.msg, '提醒', {
              confirmButtonText: '确定',
              callback: () => {
                router.push('/login')
              }
            })
            break
          case 403:
            Message.warning({
              message: data.msg,
              duration: 1500,
              showClose: false
            })
            break
          default:
        }

        /**
         * 若不是正确的code，且已登录，就抛出异常
         * const err = new Error(data.desc)
         * err.data = data
         * err.response = response
         * throw err
         * */

        return data
      },
      error => {
        NProgress.done()
        if (error && error.response) {
          // 判断请求超时
          if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            Message.error('请求超时')
          } else {
            switch (error.response.status) {
              case 400:
                error.message = '请求错误'
                break

              case 401:
                error.message = '未授权，请登录'
                break

              case 403:
                error.message = '拒绝访问'
                break

              case 404:
                error.message = `请求地址出错: ${error.response.config.url}`
                break

              case 408:
                error.message = '请求超时'
                break

              case 500:
                error.message = '服务器内部错误'
                break

              case 501:
                error.message = '服务未实现'
                break

              case 502:
                error.message = '网关错误'
                break

              case 503:
                error.message = '服务不可用'
                break

              case 504:
                error.message = '网关超时'
                break

              case 505:
                error.message = 'HTTP版本不受支持'
                break

              default:
            }
            Message.error(error.message)
          }
        }
        return Promise.reject(error)// 返回接口错误信息
      }
    )

    // 请求处理
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}
