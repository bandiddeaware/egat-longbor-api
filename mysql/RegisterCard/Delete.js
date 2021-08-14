var mysql = require('../connection')

const Delete = async (
  card_id,
) => {
  const conn = await mysql.connection()
  const pareseCard = (card_id) => {
    const type_c = card_id.match(/[a-zA-Z]+/g)
    const id_c = card_id.match(/[1-90-0]+/g)
    var new_card_id = id_c[0] + id_c[1]
    var new_card_tpye = 0
    if (type_c === "A"){
      new_card_tpye = 2
    } else if (type_c === "B"){
      new_card_tpye = 3
    } else if (type_c === "C"){
      new_card_tpye = 5
    } else if (type_c === "D"){
      new_card_tpye = 4
    } else {
      new_card_tpye = 0
    }
    return {
      card_id : new_card_id,
      card_type: new_card_tpye
    }
  }

  try {
    var card_detail = pareseCard(card_id)
    var query = `DELETE FROM card WHERE id = ${card_detail.card_id}`
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