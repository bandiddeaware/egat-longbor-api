var mysql = require('../connection')

const Find = async (
  id_card,
  name,
  surname,
  uhf_id,
  mifare_id,
  card_type,
  is_expired_card,
  is_accept_mine,
  offset,
  limit,
) => {
  const conn = await mysql.connection()
  try {

    const WhereParameter = (
      id_card,
      name,
      surname,
      uhf_id,
      mifare_id,
      card_type,
    ) => {
    
      if (
        id_card === undefined && 
        name === undefined && 
        surname === undefined && 
        uhf_id === undefined && 
        mifare_id === undefined && 
        card_type === undefined
      ){
        return `(((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 `
      }
    
      if (card_type !== undefined){
        if (name !== undefined && surname !== undefined){
          return `
            ps.firstname LIKE "%${name}%" AND ps.lastname LIKE "%${surname}%" AND ps.type = ${card_type} AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        if (name !== undefined){
          return `
            ps.firstname LIKE "%${name}%" AND ps.type = ${card_type} AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        if (surname !== undefined){
          return `
            ps.lastname LIKE "%${surname}%" AND ps.type = ${card_type} AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        if (id_card !== undefined) {
          return `
            ps.idcard LIKE "%${id_card}%" AND ps.type = ${card_type} AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        // ----------------- filter uhf_id, mifare_id -----------------
        if (uhf_id !== undefined) {
          return `
            card.uhf_id LIKE "%${uhf_id}%" AND ps.type = ${card_type} AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        if (mifare_id !== undefined) {
          return `
            card.mifare_id LIKE "%${mifare_id}%" AND ps.type = ${card_type} AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        return `ps.type = ${card_type} AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 `
      }else {
        if (name !== undefined && surname !== undefined){
          return `
            ps.firstname LIKE "%${name}%" AND ps.lastname LIKE "%${surname}%" AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        if (name !== undefined){
          return `
            ps.firstname LIKE "%${name}%" AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        if (surname !== undefined){
          return `
            ps.lastname LIKE "%${surname}%" AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        if (id_card !== undefined) {
          return `
            ps.idcard LIKE "%${id_card}%" AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        // ----------------- filter uhf_id, mifare_id -----------------
        if (uhf_id !== undefined) {
          return `
            card.uhf_id LIKE "%${uhf_id}%" AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
        if (mifare_id !== undefined) {
          return `
            card.mifare_id LIKE "%${mifare_id}%" AND (((ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1) OR ( (ps.type >=3 AND ps.type <=5 AND pt.is_temporary = 1)  )  ) ) AND ps.company_id <> 0 
          `
        }
      }
    }
    const WhereStatus = (
      is_expired_card,
      is_accept_mine,
    ) => {
      is_expired_card = (is_expired_card !== undefined)
      is_accept_mine = (is_accept_mine !== undefined)
      
      var count = 0
      var q_arr = []
      var query_out = ''
      if (is_expired_card) { q_arr.push(`ps.card_expired < now()`);count++; }
      if (is_accept_mine) { q_arr.push(`ps.mine_permit = 1`);count++; }
    
      for (var i = 0;i < (count);i++){
        query_out += `${q_arr[i]} ${(i !== count - 1 ? "AND": "")} `
      }
      if (!is_expired_card && !is_accept_mine){
        query_out = ``
      }
      return query_out
    }

    // ps.id AS id,
    // ps.firstname AS firstname,
    // ps.lastname AS lastname,
    // ps.idcard AS idcard, 
    // ps.mine_permit AS mine_permit,
    // ps.card_expired AS card_expired,
    // cp.name AS company_name,
    // card.*,
    // ct.*,

    var string_query = `
      SELECT 
        ps.id AS person_id,
        ps.*,
        
        card.id AS card_id, 
        card.uhf_id AS card_uhf_id, 
        card.mifare_id AS card_mifare_id, 
        card.status AS card_status,
        pt.description AS person_type_description,

        cp.*,
        
        ps.contract_num AS contract_number,

        cp.name AS company_name,
        contract.start_date AS contract_start,
        contract.end_date AS contract_end,
        pt.is_temporary AS is_temporary,
        pt.id AS person_type_id

      FROM person AS ps

      LEFT JOIN card AS card
        ON card.id = ps.card_id

      LEFT JOIN company AS cp
        ON ps.company_id = cp.id

      LEFT JOIN contract as  contract
        ON contract.number = ps.contract_num

      LEFT JOIN person_type AS pt
        ON pt.id = ps.type

      WHERE 
        ${(WhereParameter(  
          id_card,
          name,
          surname,
          uhf_id,
          mifare_id,
          card_type,
        ) === "" && WhereStatus(
          is_expired_card,
          is_accept_mine,
        ) === "" ? "1": WhereParameter(  
          id_card,
          name,
          surname,
          uhf_id,
          mifare_id,
          card_type,
        ) + (WhereParameter(  
          id_card,
          name,
          surname,
          uhf_id,
          mifare_id,
          card_type,
        ) !== '' && WhereStatus(
          is_expired_card,
          is_accept_mine,
        ) !== '' ? " AND ": "") + WhereStatus(
          is_expired_card,
          is_accept_mine,
        ))}


        LIMIT ${limit} OFFSET ${offset}
    `
    const [rows] = await conn.query(string_query)
    var string_query = `
    SELECT 
      COUNT(*) AS length
    FROM person AS ps

    LEFT JOIN card AS card
      ON card.id = ps.card_id

    LEFT JOIN company AS cp
      ON ps.company_id = cp.id

    LEFT JOIN contract as  contract
      ON contract.number = ps.contract_num

    LEFT JOIN person_type AS pt
      ON pt.id = ps.type

    WHERE 
      ${(WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        card_type,
      ) === "" && WhereStatus(
        is_expired_card,
        is_accept_mine,
      ) === "" ? "1": WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        card_type,
      ) + (WhereParameter(  
        id_card,
        name,
        surname,
        uhf_id,
        mifare_id,
        card_type,
      ) !== '' && WhereStatus(
        is_expired_card,
        is_accept_mine,
      ) !== '' ? " AND ": "") + WhereStatus(
        is_expired_card,
        is_accept_mine,
      ))}
  `
  const [count] = await conn.query(string_query)
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