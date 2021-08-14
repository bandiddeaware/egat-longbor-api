var mysql = require('../../connection')

module.exports = async (person_id, num_card) => {
  const conn = await mysql.connection()
  // =============== find person =============================================
  var query = `
    SELECT * FROM person WHERE id IN ${person_id} AND (card.type <> 1 OR ps.card_id IS NULL) AND card_id IS NOT NULL;
  `
  const [rows_person] = await conn.query(query)
  var gen_card_person = []
  rows_person.forEach((item, index) => {
    gen_card_person.push({
      id_person: item.id,
      card_id: item.card_id
    })
  })
  return gen_card_person
}