var mysql = require('../connection')

const Find = async (
  id_card,
  name,
  surname,
  uhf_id,
  mifare_id,
  company_name,
  is_card_number,
  is_expire_card,
  is_accept_mine,
  offset, 
  limit 
) => {
  const conn = await mysql.connection()
  try {
    const WhereParameter = (
      id_card,
      name,
      surname,
      uhf_id, 
      mifare_id,
      company_name,
    ) => {

      if (
        id_card === undefined && 
        name === undefined && 
        surname === undefined && 
        company_name === undefined && 
        uhf_id === undefined && 
        mifare_id === undefined
      ){
        return `(company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))`
      }

      if (company_name !== undefined){
        if (name !== undefined && surname !== undefined){
          return `
            ps.firstname LIKE '%${name}%' AND ps.lastname LIKE '%${surname}%' AND cp.name LIKE "%${company_name}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        if (name !== undefined){
          return `
            ps.firstname LIKE '%${name}%' AND cp.name LIKE "%${company_name}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        if (surname !== undefined){
          return `
            ps.lastname LIKE '%${surname}%' AND cp.name LIKE "%${company_name}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        if (id_card !== undefined) {
          return `
            ps.idcard LIKE "%${id_card}%" AND cp.name LIKE "%${company_name}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        // ------------------------- find by uhf_id or mifare_id [ uhf_id, mifare_id ] -------------------------
        if (uhf_id !== undefined){
          return `
            card.uhf_id LIKE "%${uhf_id}% AND cp.name LIKE "%${company_name}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        if (mifare_id !== undefined){
          return `
            card.mifare_id LIKE "%${mifare_id}%" AND cp.name LIKE "%${company_name}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        return `
          cp.name LIKE "%${company_name}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
        `
      }else {
        if (name !== undefined && surname !== undefined){
          return `
            ps.firstname LIKE '%${name}%' AND ps.lastname LIKE '%${surname}%' AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        if (name !== undefined){
          return `
            ps.firstname LIKE '%${name}%' AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        if (surname !== undefined){
          return `
            ps.lastname LIKE '%${surname}%' AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        if (id_card !== undefined) {
          return `
            ps.idcard LIKE "%${id_card}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        // ------------------------- find by uhf_id or mifare_id [ uhf_id, mifare_id ] -------------------------
        if (uhf_id !== undefined){
          return `
            card.uhf_id LIKE "%${uhf_id}% AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        if (mifare_id !== undefined){
          return `
            card.mifare_id LIKE "%${mifare_id}%" AND (company_id = 0 OR (ps.type <= 2 AND pt.is_temporary = 0))
          `
        }
        return ``
      }
    }

    const WhereStatus = (
      is_card_number,
      is_expire_card,
      is_accept_mine,
    ) => {
      is_card_number = (is_card_number !== undefined)
      is_expire_card = (is_expire_card !== undefined)
      is_accept_mine = (is_accept_mine !== undefined)
      
      var count = 0
      var q_arr = []
      var query_out = ''
      if (is_accept_mine) { q_arr.push(`ps.mine_permit = 1`);count++; }
      if (is_card_number) { q_arr.push(`ps.card_id IS NOT NULL`);count++; }
      if (is_expire_card) { q_arr.push(`ps.card_expired < now()`);count++; }

      for (var i = 0;i < (count);i++){
        query_out += `${q_arr[i]} ${(i !== count - 1 ? "AND": "")} `
      }
      if (!is_card_number && !is_expire_card && !is_accept_mine){
        query_out = ``
      }
      return query_out
      // return  `
      //   ${(is_accept_mine ? "ps.mine_permit = 1": "")} 
      //     ${((is_card_number || is_expire_card) ? "AND": "")}
      //   ${(is_card_number ? "ps.card_id IS NOT NULL": "")}  
      //     ${(is_expire_card && (is_card_number && is_accept_mine) ? "AND": "")}
      //   ${(is_expire_card ? "ps.card_expired < now()": "")}
      //   ${(is_accept_mine && is_card_number && is_expire_card ? "1": "")}
      // `
    }
    var query_string = `
      SELECT 
        ps.id as person_id,
        ps.*, 
        
        card.id AS card_id, 
        card.uhf_id AS card_uhf_id, 
        card.mifare_id AS card_mifare_id, 
        card.status AS card_status, 
        pt.description AS person_type_description,
        
        ps.contract_num AS contract_number,

        card_st.*,
        cp.name AS company_name,
        contract.start_date AS contract_start,
        contract.end_date AS contract_end,
        ps.type AS person_type_id,
        pt.is_temporary AS is_temporary

      FROM person as ps
      
      LEFT JOIN company as cp
        ON ps.company_id = cp.id
      
      LEFT JOIN card as card
        ON ps.card_id = card.id
      
      LEFT JOIN card_status AS card_st
        ON card.status = card_st.id

      LEFT JOIN contract as  contract
        ON contract.number = ps.contract_num
      
      LEFT JOIN person_type AS pt
        ON pt.id = ps.type

      WHERE ${(WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        company_name,
      ) === "" && WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ) === "" ? "1": WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        company_name,
      ) + (WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        company_name,
      ) !== '' && WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ) !== '' ? " AND ": "") + WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ))}
    
      LIMIT ${limit} OFFSET ${offset}
    `
    const [rows] = await conn.query(query_string)
    var query_string = `
      SELECT COUNT(*) as length
      
      FROM person as ps
      
      LEFT JOIN company as cp
        ON ps.company_id = cp.id
      
      LEFT JOIN card as card
        ON ps.card_id = card.id
      
      LEFT JOIN card_status AS card_st
        ON card.status = card_st.id
    
      LEFT JOIN person_type AS pt
        ON pt.id = ps.type
        
      WHERE    ${(WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        company_name,
      ) === "" && WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ) === "" ? "1": WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        company_name,
      ) + (WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        company_name,
      ) !== '' && WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ) !== '' ? " AND ": "") + WhereStatus(
        is_card_number,
        is_expire_card,
        is_accept_mine,
      ))}
    `
    const [count] = await conn.query(query_string)
    conn.end();
    return {
      isError: false,
      data: rows,
      count: count
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
  Find
};