var mysql = require('../connection')

const login = async (user, pass) => {
  const conn = await await mysql.connection()
  try {
    const [rows] = await conn.query(`SELECT * FROM tb_user WHERE username = "${user}" and PASSWORD = "${pass}";`)
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

module.exports = {
  login
};