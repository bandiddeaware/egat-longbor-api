var mysql = require('../../connection')

module.exports = async (card_id) => {
  const conn = await mysql.connection()
  try {
    var getQuery = ``
    card_id.forEach((element, index) => {
      getQuery += `
        (
          "${element.card_id}" , 1
        )${(index === (card_id.length - 1) ? "": ",")}
      `
    });
    var query = `
      INSERT INTO card(
        id, type
      ) VALUES ${getQuery}
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