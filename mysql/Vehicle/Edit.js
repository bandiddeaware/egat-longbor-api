var mysql = require('../connection')
var chcekNumuric = require("../../commons/checkNumuric")

const check_type_Id = async (type_Id, conn) => {
  var check = chcekNumuric(type_Id)
  if (check){
    return {
      status: true,
      type_Id: type_Id
    }
  }else {
    // insert and find id
    var name = type_Id
    var query = `
      INSERT INTO vehicle_type SET    
        type = "${name}"
    `
    console.log(`SELECT COUNT(*) AS count FROM vehicle_type WHERE type LIKE "${name}"`)
    const [check_tb_type_dup] = await conn.query(`SELECT COUNT(*) AS count FROM vehicle_type WHERE type LIKE "${name}"`)
    if (check_tb_type_dup[0].count > 0){
      return {
        status: false,
      }
    }
    const [rows] = await conn.query(query)
    return {
      status: true,
      type_Id: rows.insertId
    }
  }
}

const check_brand_id = async (brand_id, conn) => {
  console.log(brand_id)
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
    console.log(`SELECT COUNT(*) AS count FROM vehicle_brand WHERE name LIKE "${name}"`)
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
  type_Id,
  remark,
  model,
  egat_plate,
  faction2_DIV,
  faction2_D_ABBR,
  vehicle_id
) => {
  const conn = await mysql.connection()
  try {

    // =================== check type =================== 
    type_Id = await check_type_Id(type_Id, conn)
    if (type_Id.status === false){
      return {
        isError: true,
        data: "type name is duplicate."
      }
    } else {
      type_Id = type_Id.type_Id
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
    if (type_Id !== undefined && type_Id !== "undefined") {
      query_value.push(` type_Id= "${type_Id}" `)
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
    var str = ''
    query_value.forEach((v, i) => {  str += v + (i !== query_value.length-1 ? ",": "")})
    var query = `
      UPDATE vehicle SET    
        ${ str  }
      WHERE id = ${vehicle_id};
    `
    console.log(query)
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