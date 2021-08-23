var mysql = require('../connection')

const Find = async () => {
  const conn = await mysql.connection()
  try {
    const [rows] = await conn.query(`SELECT * FROM card WHERE type > 50 AND status = 0 AND id NOT LIKE "1000%"`)
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