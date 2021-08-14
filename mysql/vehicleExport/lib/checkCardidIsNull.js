var mysql = require('../../connection')

module.exports = async (person_id) => {
  const conn = await mysql.connection()
  try {
    var query = `
      SELECT SUM(IF(card_id IS NOT NULL, 1, 0)) AS CheckNull FROM person WHERE id IN ${person_id} AND (card.type <> 1 OR ps.card_id IS NULL)
    `
    const [rows] = await conn.query(query)
    conn.end();
    return {
      isError: false,
      data: rows,
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e
    }
  }
}