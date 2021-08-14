const addDigiNubmerStr = (snum) => {
  return ((Number(snum) < 10) ? "0" + snum.toString(): snum.toString())
}

module.exports = function parseDateTime () {
  var time = new Date()
  return `${time.getFullYear()}-${addDigiNubmerStr(time.getMonth() + 1)}-${addDigiNubmerStr(time.getDate())} ${addDigiNubmerStr(time.getHours())}:${addDigiNubmerStr(time.getMinutes())}:${addDigiNubmerStr(time.getSeconds())}`
}