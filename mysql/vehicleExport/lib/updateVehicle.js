var mysql = require('../../connection')

module.exports = async (card_id) => {
  const conn = await mysql.connection()
  try {
    var getQuery_when = ``
    var getQuery_where = ``
    card_id.forEach((element, index) => {
      getQuery_when += `
        WHEN ${element.id_vehicle} THEN ${element.card_id}
      `
      getQuery_where += `
        ${element.id_vehicle} ${(index === (card_id.length - 1) ? "": ",")}
      `
    });
    var query = `
      UPDATE vehicle SET card_id = CASE id 
          ${getQuery_when}
        ELSE card_id 
      END
      WHERE id IN (${getQuery_where})
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