export default class toolUtil {
  static msg (res, error) {
    if (res && res.code === 1) {
      let errorData = res.data
      Object.keys(errorData).forEach(key1 => {
        Object.keys(error).forEach(key2 => {
          if (key1 === key2) {
            error[key2] = errorData[key1]
          }
        })
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
