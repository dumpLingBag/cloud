export function httpData (data) {
  if (data) {
    let obj = {}
    Object.keys(data).forEach(key => {
      if (key === 'search') {
        let d = data[key]
        Object.keys(d).forEach(k => {
          obj[k] = d[k]
        })
      } else {
        obj[key] = data[key]
      }
    })
    return obj
  }
}
