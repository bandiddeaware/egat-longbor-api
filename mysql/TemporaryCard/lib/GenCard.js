var mysql = require('../../connection')

const addDigiNubmerStr = (snum) => {
  // 2021
  // 00003 = 5
  if (snum.length === 5 ){
    return snum
  }
  var zoro = ''
  for (var i = snum.length;i <  5;i++){
    zoro += "0"
  }
  return zoro+snum
}

module.exports = async (card_value) => {
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


  // // =============== find last temporary card_id ==============================
  // var query_card_temporary = `
  //   SELECT id FROM card WHERE ( id > 200000000 && id < 1000000000 ) OR ( id >= 2000000000) ORDER BY id DESC  LIMIT 1 
  // `
  // const [rows_card_temporary] = await conn.query(query_card_temporary)
  // var egat_temporary_card = (rows_card_temporary[0].id).toString()
  // var gen_card_person = []
  for (var i = 0;i < card_value;i++){
    gen_card_person.push({
      card_id: new Date().getFullYear().toString() + addDigiNubmerStr((Number(egat_temporary_card.substring(4)) + 1 + i).toString())
    })
  }
  return gen_card_person



  // const conn = await mysql.connection()
  // var query = `
  //   SELECT IF(id IS NULL, 0, id) FROM card WHERE ( id >= 1000000000 ) ORDER BY id DESC  LIMIT 1 
  // `
  // const [rows] = await conn.query(query)
  // var row_id = rows[0].id.toString()
  // var split_id = {
  //   id: row_id.substring(4),
  //   year: row_id.substring(0, 4),
  // }
  // var gen_id = []
  // for (var i=0;i<num_card;i++){
  //   gen_id.push({
  //     year: new Date().getFullYear().toString(),
  //     id: (Number(split_id.id) + i + 1).toString()
  //   })
  // }
  // return gen_id
}