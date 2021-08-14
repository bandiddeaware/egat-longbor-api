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

const addDigiNubmerStr_egat_card = (snum) => {
  // 1000
  // 571110 = 6
  if (snum.length === 6 ){
    return snum
  }
  var zoro = ''
  for (var i = snum.length;i <  6;i++){
    zoro += "0"
  }
  return zoro+snum
}

module.exports = async (vehicle_id, num_card) => {
  const conn = await mysql.connection()

  var gen_card_vehicle = [], egat_temporary_card = ""
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
console.log("egat_temporary_card :", egat_temporary_card)



  // =============== find vehicle =============================================
  var query = `
    SELECT vh.id AS vehicle_id, vh.* FROM vehicle AS vh LEFT JOIN card AS card ON vh.card_id = card.id WHERE vh.id IN ${vehicle_id} AND ((card.type > 100) OR vh.card_id IS NULL) AND vh.card_id IS NULL
  `
  const [rows_vehicle] = await conn.query(query)
  console.log(rows_vehicle)
  rows_vehicle.forEach((item, index) => {
    if (item.egat_plate === null){
      // not egat vehicle
      gen_card_vehicle.push({
        id_vehicle: item.vehicle_id,
        card_id: new Date().getFullYear().toString() + addDigiNubmerStr((Number(egat_temporary_card.substring(4)) + 1 + index).toString())
      })
    } else {
      // egat vehicle
      gen_card_vehicle.push({
        id_vehicle: item.id,
        card_id: "1000" + addDigiNubmerStr_egat_card((item.vehicle_id).toString())
        // 1000 571110
      })
    }
  })

  return gen_card_vehicle
}