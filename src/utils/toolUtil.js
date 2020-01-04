export default class toolUtil {
  static msg (res, error) {
    if (res && res.code === 1) {
      let result = JSON.parse(res.msg)
      Object.keys(result).forEach(key => {
        error[key] = result[key]
      })
    }
  }

  static clearForm (form) {
    if (form) {
      Object.keys(form).forEach(key => {
        form[key] = ''
      })
    }
  }

  static toLowerLine (str) {
    let temp = str.replace(/[A-Z]/g, res => {
      return '_' + res.toLowerCase()
    })
    if (temp.slice(0, 1) === '_') {
      temp = temp.slice(1)
    }
    return temp
  }
}
