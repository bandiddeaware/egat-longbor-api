var mysql = require('./../connection')

module.exports = async () => {
  const conn = await mysql.connection()
  try {
    const [rows] = await conn.query(`SELECT * FROM link_grafana`)
    conn.end();
    return {
      isError: false,
      data: rows
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e
    }
  }
}