var mysql = require('../connection')

const Delete = async (id_person) => {
  const conn = await mysql.connection()
  try {
    var query = `DELETE FROM person WHERE id=${id_person}`
    const [rows] = await conn.query(query)
    conn.end();
    return {
      isError: false,
      data: rows,
      inserted: rows.affectedRows
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
  Delete
};