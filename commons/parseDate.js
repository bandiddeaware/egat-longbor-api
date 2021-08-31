const addDigiNubmerStr = (snum) => {
  return ((Number(snum) < 10) ? "0" + snum.toString(): snum.toString())
}

module.exports = function parseDateTime (date) {
  var time = new Date(date)
  return `${time.getFullYear()}-${addDigiNubmerStr(time.getMonth() + 1)}-${addDigiNubmerStr(time.getDate())}`
}