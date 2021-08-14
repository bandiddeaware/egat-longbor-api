var mysql = require('../connection')

const FindPerson = async (
  idcard,
  firstname,
  lastname,
  company_name,
  card_type,
  is_in_assambly_point,
  offset, 
  limit,
  sort,
  sort_type
) => {
  const conn = await mysql.connection()

  const check_sort_type = (sort_type) => {
    var query_sort = ''
    if (sort_type === 'company_name'){
      query_sort = 'cp.name'
    }else if (sort_type === 'name'){
      query_sort = 'ps.firstname'
    }else if (sort_type === 'surname') {
      query_sort = 'ps.lastname'
    }else if (sort_type === 'card_type'){
      query_sort = 'card_t.description'
    } else if (sort_type === 'person_id') {
      query_sort = 'ps.id'
    }else {
      query_sort = 'ps.id'
    }
    return query_sort
  }
  const searchBy_name_company = (
    idcard,
    firstname,
    lastname,
    company_name,
    card_type
  ) => {
    var query_out = ""
    var count = 0
    var q_arr = []
    if (idcard !== undefined) { q_arr.push(`ps.idcard LIKE '%${idcard}%'`); count++; }
    if (firstname !== undefined) { q_arr.push(`ps.firstname LIKE '%${firstname}%'`); count++; }
    if (lastname !== undefined) { q_arr.push(`ps.lastname LIKE '%${lastname}%'`); count++; }
    if (company_name !== undefined) { q_arr.push(`cp.name LIKE "%${company_name}%"`); count++; }
    if (card_type !== undefined) { q_arr.push(`card.type = ${card_type}`); count++; }
    if (q_arr.length === 0){
      return ''
    }
    for (var i = 0;i < (count);i++){
      query_out += `${q_arr[i]} ${(i !== count - 1 ? "AND": "")} `
    }
    return query_out
  }
  try {
    const query_string_length = `
      SELECT 
    
        COUNT(*) AS LENGTH

      FROM person AS ps 

      LEFT JOIN card AS card
        ON ps.card_id = card.id

      LEFT JOIN card_type AS card_t
        ON card.type = card_t.id

      LEFT JOIN card_status AS card_st
        ON card.status = card_st.id

      LEFT JOIN company AS cp
        ON cp.id = ps.company_id

      WHERE
        ps.check_in_at > ps.check_out_at AND 
        
        ps.check_in_at IS NOT NULL AND 
        ps.check_out_at IS NOT NULL AND
        ps.asbp_checked_at IS NOT NULL AND 

        ${ (is_in_assambly_point !== undefined ? `ps.asbp_checked_at > ps.check_in_at AND ` : ``) }

        ps.card_id IS NOT NULL
        
        ${
          (searchBy_name_company(
            idcard,
            firstname,
            lastname,
            company_name,
            card_type
          ) !== "" ? " AND " + searchBy_name_company(
            idcard,
            firstname,
            lastname,
            company_name,
            card_type
          ): "")
        }
    `
    const [length] = await conn.query(query_string_length)
    const query_string_list_person = `

    SELECT 
	
      ps.id AS person_id,
      ps.idcard,
      ps.firstname ,
      ps.lastname,
      cp.id AS company_id,
      cp.name AS company_name,
      card_st.description AS card_status_desc,
      card_t.description AS card_type_desc,
      card.id AS card_id,

      IF(ps.asbp_checked_at > ps.check_in_at, TRUE, FALSE) AS is_in_assambly_point,
      ps.check_in_at,
      ps.check_out_at,
      ps.asbp_checked_at

    FROM person AS ps 

    LEFT JOIN card AS card
      ON ps.card_id = card.id

    LEFT JOIN card_type AS card_t
      ON card.type = card_t.id

    LEFT JOIN card_status AS card_st
      ON card.status = card_st.id

    LEFT JOIN company AS cp
      ON cp.id = ps.company_id

    WHERE 
      ps.check_in_at > ps.check_out_at AND 
      
      ps.check_in_at IS NOT NULL AND 
      ps.check_out_at IS NOT NULL AND
      ps.asbp_checked_at IS NOT NULL AND 
      
      ${ (is_in_assambly_point !== undefined ? `ps.asbp_checked_at > ps.check_in_at AND ` : ``) }

      ps.card_id IS NOT NULL

      ${
        (searchBy_name_company(
          idcard,
          firstname,
          lastname,
          company_name,
          card_type
        ) !== "" ? " AND " + searchBy_name_company(
          idcard,
          firstname,
          lastname,
          company_name,
          card_type
        ): "")
      }

      ORDER BY ${check_sort_type(sort_type)}  ${sort}

      LIMIT ${limit} OFFSET ${offset}
    `
    const [list_person] = await conn.query(query_string_list_person)
    conn.end();
    return {
      isError: false,
      data: list_person,
      length: length[0].LENGTH
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
  FindPerson
};