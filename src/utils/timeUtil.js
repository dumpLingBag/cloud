export default class timeUtil {
  static time (time) {
    let year = time.getFullYear()
    let month = time.getMonth() + 1 < 10 ? '0' + time.getMonth() : time.getMonth()
    let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()

    let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    let seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()

    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
  }
}
