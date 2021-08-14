var mysql = require('../../connection')

const addDigiNubmerStr = (snum) => {
  // 2021
  // 00003 = 5
  if (snum.length >= 5 ){
    return snum
  }
  var zoro = ''
  for (var i = snum.length;i <  5;i++){
    zoro += "0"
  }
  return zoro+snum
}

module.exports = async (person_id, num_card) => {
  const conn = await mysql.connection()
  var gen_card_person = [], egat_temporary_card = ""
  // =============== check new year ===========================================
  var query_find_new_year = `
    SELECT COUNT(*) AS count_of_year FROM card WHERE id LIKE "${new Date().getFullYear().toString()}%"
  `
  console.log("query: ", query_find_new_year)
  const [find_new_year] = await conn.query(query_find_new_year)
  console.log("find_new_year: ", find_new_year)
  if (find_new_year[0].count_of_year === 0){
    // =============== re gen card id of the year ==============================
    egat_temporary_card = `${new Date().getFullYear().toString()}00000`
  } else {

    // =============== find last temporary card_id ==============================
    var query_card_temporary = `
      SELECT id FROM card WHERE ( id > 200000000 && id < 1000000000 ) OR ( id >= 2000000000) ORDER BY id DESC  LIMIT 1 
    `
    const [rows_card_temporary] = await conn.query(query_card_temporary)
    egat_temporary_card = (rows_card_temporary[0].id).toString()

  }

  // =============== find person =============================================
  var query = `
    SELECT ps.id AS person_id, ps.*,card.* FROM person AS ps LEFT JOIN card AS card ON ps.card_id = card.id  WHERE ps.id IN ${person_id} AND (card.type <> 1 OR ps.card_id IS NULL) AND card_id IS NULL;
  `
  console.log("query person : ")
  console.log(query)
  const [rows_person] = await conn.query(query)
  console.log("rows_person :", rows_person.length)
  console.log("gen_card_person : ", gen_card_person)
  rows_person.forEach((item, index) => {
    if (item.company_id !== 0){
      // temporary person 
      gen_card_person.push({
        id_person: item.person_id,
        card_id: new Date().getFullYear().toString() + addDigiNubmerStr((Number(egat_temporary_card.substring(4)) + 1 + index).toString())
      })
    } else {
      // egat person
      gen_card_person.push({
        id_person: item.person_id,
        card_id: "1000" + (item.egat_person_code).toString()
      })
    }
  })
  console.log("return gen_card_person : ", gen_card_person)
  return gen_card_person
}