var mysql = require('../connection')
var chcekNumuric = require("../../commons/checkNumuric")

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

const Add = async (
  idcard, 
  name_title, 
  firstname, 
  lastname, 
  birthday, 
  sex, 
  religion, 
  house_no, 
  village_no, 
  alley, 
  lane, 
  road, 
  sub_district, 
  district, 
  provinces, 
  idcard_expired, 
  picture, 
  company_id, 
  created_at, 
  modified_at, 
  mine_permit, 
  card_id, 
  card_expired, 
  card_status
) => {
  const conn = await mysql.connection()
  try {

    company_id = await check_company_id(company_id, conn)

    if (company_id.status === false){
      return {
        isError: true,
        data: "company is duplicate."
      }
    } else {
      company_id = company_id.company_id
    }

    var query = `
    INSERT INTO person SET    
      idcard =  '${idcard}', 
      name_title =  '${name_title}', 
      firstname =  '${firstname}', 
      lastname =  '${lastname}', 

      ${( birthday === undefined || birthday === "undefined" ? `` : `birthday =  '${birthday}', ` )}
      ${( sex === undefined || sex === "undefined" ? `` : `sex =  '${sex}', ` )}
      ${( religion === undefined || religion === "undefined" ? `` : `religion =  '${religion}', ` )}
      ${( house_no === undefined || house_no === "undefined" ? `` : `house_no =  '${house_no}', ` )}
      ${( village_no === undefined || village_no === "undefined" ? `` : `village_no =  '${village_no}', ` )}
      ${( alley === undefined || alley === "undefined" ? `` : `alley =  '${alley}', ` )}
      ${( lane === undefined || lane === "undefined" ? `` : `lane =  '${lane}', ` )}
      ${( road === undefined || road === "undefined" ? `` : `road =  '${road}', ` )}
      ${( sub_district === undefined || sub_district === "undefined" ? `` : `sub_district =  '${sub_district}', ` )}
      ${( district === undefined || district === "undefined" ? `` : `district =  '${district}', ` )}
      ${( provinces === undefined || provinces === "undefined" ? `` : `provinces =  '${provinces}', ` )}
      ${( idcard_expired === undefined || idcard_expired === "undefined" ? `` : `idcard_expired =  '${idcard_expired}', ` )}
      ${( picture === undefined || picture === "undefined" ? `` : `picture =  '${picture}',` )}
      ${( card_expired === undefined || card_expired === "undefined" ? `` : `card_expired =  '${card_expired}', ` )}


      company_id =  '${company_id}', 
      created_at =  '${created_at}', 
      modified_at =  '${modified_at}', 
      mine_permit =  '${mine_permit}', 
      
      ${( card_id === undefined || card_id === "undefined" ? `` : `card_id =  '${card_id}',` )}

      card_status =  '${card_status}'
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
  Add
};