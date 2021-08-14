var mysql = require('../connection')

const Find = async () => {
  const conn = await mysql.connection()
  try {
    const [rows] = await conn.query(`SELECT * FROM tb_provinces WHERE 1`)
    conn.end();
    return {
      isError: false,
      data: rows,
      count: rows.length
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e
    }
  }
}

module.exports = {
  Find
};