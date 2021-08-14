var mysql = require('../connection')

const Edit = async (
  card_id,
  uhf,
  mifare
) => {
  const conn = await mysql.connection()
  const pareseCard = (card_id) => {
    return {
      card_id : card_id,
      card_type: 0
    }
    if (card_id >= 1000000000){
      return {
        card_id : card_id,
        card_type: 1
      }
    }
    const type_c = card_id.match(/[a-zA-Z]+/g)
    const id_c = card_id.match(/[1-90-0]+/g)
    var new_card_id = id_c[0] + id_c[1]
    var new_card_tpye = 0
    if (type_c[0] === "A"){
      new_card_tpye = 2
    } else if (type_c[0] === "B"){
      new_card_tpye = 3
    } else if (type_c[0] === "C"){
      new_card_tpye = 5
    } else if (type_c[0] === "D"){
      new_card_tpye = 4
    } else {
      new_card_tpye = 1
    }
    if (new_card_tpye === 1){
      return {
        card_id : card_id,
        card_type: new_card_tpye
      }
    }
    return {
      card_id : new_card_id,
      card_type: new_card_tpye
    }
  }

  try {
    var card_detail = pareseCard(card_id)
    var query = `
      UPDATE card SET
        uhf_id =  '${uhf}', 
        mifare_id =  '${mifare}',
        status = 1
      WHERE id = ${card_detail.card_id}
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
}

module.exports = {
  Edit
};