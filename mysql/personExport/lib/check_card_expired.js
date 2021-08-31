var mysql = require('../../connection')
var parseDate = require("./../../../commons/parseDate")
const get_card_expired_from_contract = async (contract_num, conn) => {
  var query = `SELECT end_date FROM contract WHERE NUMBER LIKE "${contract_num}"`
  const [result] = await conn.query(query)
  return result[0].end_date
}

module.exports = async (person_id) => {
  const conn = await mysql.connection()
  const query_find_card_expired = `
    SELECT 
      ps.id AS person_id, 
      ps.card_expired AS card_expired, 
      ctr.end_date AS contract_end_date

    FROM person AS ps 

    LEFT JOIN card AS card 
      ON ps.card_id = card.id  

    LEFT JOIN contract AS ctr
      ON ps.contract_num = ctr.number

    WHERE ps.id IN ${person_id} AND  ps.type <> 1
  `
  const [find_card_expired] = await conn.query(query_find_card_expired)
  var query_update_where = ``
  var query_update = ``
  find_card_expired.forEach((item, index) => {
    query_update_where += `WHEN ${item.person_id} THEN ${ (item.card_expired === null ? (item.contract_end_date === null ? null: `"${parseDate(item.contract_end_date)}"`): `"${parseDate(item.card_expired)}"`) } `
  })
  query_update += `
  UPDATE person SET card_expired = CASE id

    ${query_update_where}

    ELSE card_expired
  END
  WHERE id IN ${person_id}
  `
  return await conn.query(query_update)
}