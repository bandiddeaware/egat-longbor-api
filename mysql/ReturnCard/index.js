var mysql = require('../connection')

module.exports = async (
  card_id,
  card_status
) => {
  const conn = await mysql.connection()
  try {
    var query = `
      UPDATE card SET    
        status =  '${card_status}'

      WHERE id = ${card_id};
    `
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
};