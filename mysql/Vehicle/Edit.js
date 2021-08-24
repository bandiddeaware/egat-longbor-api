var mysql = require('../connection')
var chcekNumuric = require("../../commons/checkNumuric")

const check_classification = async (classification, conn) => {
  var check = chcekNumuric(classification)
  if (check){
    return {
      status: true,
      classification: classification
    }
  }else {
    // insert and find id
    var name = classification
    var query = `
      INSERT INTO vehicle_classification SET    
        type = "${name}"
    `
    const [check_tb_type_dup] = await conn.query(`SELECT COUNT(*) AS count FROM vehicle_classification WHERE type LIKE "${name}"`)
    if (check_tb_type_dup[0].count > 0){
      return {
        status: false,
      }
    }
    const [rows] = await conn.query(query)
    return {
      status: true,
      classification: rows.insertId
    }
  }
}

const check_brand_id = async (brand_id, conn) => {
  var check = chcekNumuric(brand_id)
  if (check){
    return {
      status: true,
      brand_id: brand_id
    }
  }else {
    // insert and find id
    var name = brand_id
    var query = `
      INSERT INTO vehicle_brand SET    
        name = "${name}"
    `
    const [check_tb_brand_dup] = await conn.query(`SELECT COUNT(*) AS count FROM vehicle_brand WHERE name LIKE "${name}"`)
    if (check_tb_brand_dup[0].count > 0){
      return {
        status: false,
      }
    }
    const [rows] = await conn.query(query)
    return {
      status: true,
      brand_id: rows.insertId
    }
  }
}

const check_company_id = async (company_id, conn) => {
  var check = chcekNumuric(company_id)
  if (check){
    return {
      status: true,
      company_id: company_id
    }
  }else {
    // insert and find id
    var name = company_id
    var query = `
      INSERT INTO company SET    
        name = "${name}"
    `
    const [check_company_dup] = await conn.query(`SELECT COUNT(*) AS count FROM company WHERE NAME LIKE "${name}"`)
    if (check_company_dup[0].count > 0){
      return {
        status: false,
      }
    }
    const [rows] = await conn.query(query)
    return {
      status: true,
      company_id: rows.insertId
    }
  }
}

module.exports = async (
  company_id,
  card_expired,
  mine_permit,
  license,
  province_id,
  brand_id,
  classification,
  remark,
  model,
  egat_plate,
  faction2_DIV,
  faction2_D_ABBR,
  vehicle_id,
  vehicle_type
) => {
  const conn = await mysql.connection()
  try {

    // =================== check type =================== 
    classification = await check_classification(classification, conn)
    if (classification.status === false){
      return {
        isError: true,
        data: "classification name is duplicate."
      }
    } else {
      classification = classification.classification
    }

    // =================== check brand =================== 
    brand_id = await check_brand_id(brand_id, conn)
    if (brand_id.status === false){
      return {
        isError: true,
        data: "brand name is duplicate."
      }
    } else {
      brand_id = brand_id.brand_id
    }

    // =================== check company =================== 
    company_id = await check_company_id(company_id, conn)
    if (company_id.status === false){
      return {
        isError: true,
        data: "company name is duplicate."
      }
    } else {
      company_id = company_id.company_id
    }

    var query_value = []
    if (company_id !== undefined && company_id !== "undefined") {
      query_value.push(` company_id= "${company_id}" `)
    }
    if (card_expired !== undefined && card_expired !== "undefined") {
      query_value.push(` card_expired= "${card_expired}" `)
    }
    if (mine_permit !== undefined && mine_permit !== "undefined") {
      query_value.push(` mine_permit= "${mine_permit}" `)
    }
    if (license !== undefined && license !== "undefined") {
      query_value.push(` license_plate= "${license}" `)
    }
    if (province_id !== undefined && province_id !== "undefined") {
      query_value.push(` province_id= "${province_id}" `)
    }
    if (brand_id !== undefined && brand_id !== "undefined") {
      query_value.push(` brand_id= "${brand_id}" `)
    }
    if (classification !== undefined && classification !== "undefined") {
      query_value.push(` classification= "${classification}" `)
    }
    if (remark !== undefined && remark !== "undefined") {
      query_value.push(` remark= "${remark}" `)
    }
    if (model !== undefined && model !== "undefined") {
      query_value.push(` model= "${model}" `)
    }
    if (egat_plate !== undefined && egat_plate !== "undefined") {
      query_value.push(` egat_plate= "${egat_plate}" `)
    }
    if (faction2_DIV !== undefined && faction2_DIV !== "undefined") {
      query_value.push(` faction2_DIV= "${faction2_DIV}" `)
    }
    if (faction2_D_ABBR !== undefined && faction2_D_ABBR !== "undefined") {
      query_value.push(` faction2_D_ABBR= "${faction2_D_ABBR}" `)
    }
    if (vehicle_type !== undefined && vehicle_type !== "undefined") {
      query_value.push(` type= "${vehicle_type}" `)
    }

    var str = ''
    query_value.forEach((v, i) => {  str += v + (i !== query_value.length-1 ? ",": "")})
    var query = `
      UPDATE vehicle SET    
        ${ str  }
      WHERE id = ${vehicle_id};
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