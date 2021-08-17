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

const check_contact = async (contract_num, contract_start_date, contract_end_date, conn) => {
  // insert and find id
  var name = contract_num
  if (name !== undefined){
    var query = `
      INSERT INTO contract SET    
        number = "${name}"
        ${(contract_start_date !== undefined ? ",start_date='" +contract_start_date+"'" : "")}
        ${(contract_end_date !== undefined ? ",end_date='" +contract_end_date+"'" : "")}
    `
    const [check_contract_dup] = await conn.query(`SELECT COUNT(*) AS count FROM contract WHERE number LIKE "${name}"`)
    if (check_contract_dup[0].count > 0){
      var update = `
        UPDATE contract SET 
        ${(contract_start_date !== undefined ? "start_date='" +contract_start_date+"'" : "")}
        ${(contract_end_date !== undefined ? ",end_date='" +contract_end_date+"'" : "")}

        WHERE number = "${contract_num}"
      `
      const [rows_update] = await conn.query(update)
      return {
        status: true,
        contract_num: name
      }
    }
    const [rows] = await conn.query(query)
    return {
      status: true,
      contract_num: name
    }
  } else {
    return {
      status: true,
      contract_num: name
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
  card_status,
  contract_num,
  contract_start_date,
  contract_end_date,
) => {
  const conn = await mysql.connection()
  try {
    // check company
    company_id = await check_company_id(company_id, conn)
    if (company_id.status === false){
      return {
        isError: true,
        data: "company is duplicate."
      }
    } else {
      company_id = company_id.company_id
    }

    // check contract
    contract_num = await check_contact(contract_num, contract_start_date, contract_end_date, conn)
    if (contract_num.status === false){
      return {
        isError: true,
        data: "contract is duplicate."
      }
    } else {
      contract_num = contract_num.contract_num
    }

    var query = `
    INSERT INTO person SET    
      idcard =  '${idcard}', 
      name_title =  '${name_title}', 
      firstname =  '${firstname}', 
      lastname =  '${lastname}', 

      ${( birthday === undefined || birthday === "undefined" || birthday === "" ? `` : `birthday =  '${birthday}', ` )}
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
      ${( idcard_expired === undefined || idcard_expired === "undefined" || idcard_expired === '' ? `` : `idcard_expired =  '${idcard_expired}', ` )}
      ${( picture === undefined || picture === "undefined" ? `` : `picture =  '${picture}',` )}
      ${( card_expired === undefined || card_expired === "undefined" || card_expired === "" ? `` : `card_expired =  '${card_expired}', ` )}

      ${(contract_num === undefined ? "": `contract_num = "${contract_num}",`)}

      company_id =  '${company_id}', 
      created_at =  '${created_at}', 
      modified_at =  '${modified_at}',  
      
      mine_permit =  '${mine_permit}'
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