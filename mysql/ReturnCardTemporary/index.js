var mysql = require('../connection')

module.exports = async (
  card_id,
  card_status,
  person_id
) => {
  const conn = await mysql.connection()
  try {
    var query = `
      UPDATE person SET    
        card_id =  NULL,
      WHERE id = ${person_id};
    `
    // remove card_id from person 
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