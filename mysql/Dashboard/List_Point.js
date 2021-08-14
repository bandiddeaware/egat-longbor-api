var mysql = require('../connection')

const FindLog = async (
  start_time, 
  stop_time,
  entrance_id,
  firstname,
  lastname,
  company_id,
  company_name,
  offset, 
  limit,
  sort,
  sort_type
) => {
  const conn = await mysql.connection()
  const check_sort_type = (sort_type) => {
    var query_sort = ''
    // apl.access_time ,
    // ps.firstname,
    // ps.lastname,
    // cn.name,
    // card.id,
    // card.type,
    // st.name,
    // ct.description AS card_type_desc,
    // cn.name AS company
    // access_time, firstname, id, card_type_desc, enchance_name
    if (sort_type === 'access_time'){
      query_sort = 'apl.access_time'
    }else if (sort_type === 'firstname'){
      query_sort = 'ps.firstname'
    }else if (sort_type === 'card_type_desc'){
      query_sort = 'ct.description'
    }else if (sort_type === 'enchance_name'){
      query_sort = 'st.name'
    }else if (sort_type === 'id'){
      query_sort = 'card.id'
    }else {
      query_sort = 'acl.access_time'
    }
    return query_sort
  }
  const searchBy_entrance_name_company = (
    entrance_id,
    firstname,
    lastname,
    company_id,
    company_name
  ) => {
    var query_out = ""
    var count = 0
    var q_arr = []
    if (entrance_id !== undefined) { q_arr.push(`apl.station_id = ${entrance_id}`); count++; }
    // if (firstname !== undefined) { q_arr.push(`ps.firstname = '${firstname}'`); count++; }
    // if (lastname !== undefined) { q_arr.push(`ps.lastname = '${lastname}'`); count++; }
    
    if (firstname !== undefined) { q_arr.push(`ps.firstname LIKE '%${firstname}%'`); count++; }
    if (lastname !== undefined) { q_arr.push(`ps.lastname LIKE '%${lastname}%'`); count++; }

    if (company_name !== undefined) { q_arr.push(`cn.name LIKE "%${company_name}%"`); count++; }
    if (q_arr.length === 0){
      return ''
    }
    for (var i = 0;i < (count);i++){
      query_out += `${q_arr[i]} ${(i !== count - 1 ? "AND": "")} `
    }
    return query_out
  }
  const check_seach = searchBy_entrance_name_company(
    entrance_id,
    firstname,
    lastname,
    company_id,
    company_name
  )
  const WhereSearch = (
    check_seach
  ) => {
    var search = ''
    if (check_seach === ''){
      search = ' '
    } else {
      search += check_seach + " AND "
    }
    return search
  }
  try {
    const query_string_length = `
      SELECT 

      COUNT(*) AS LENGTH
      
      FROM assembly_point_log AS apl 
      
      
      LEFT JOIN person AS ps
        ON apl.person_id = ps.id
      
      LEFT JOIN company AS cn
        ON ps.company_id = cn.id
      
      LEFT JOIN card AS card
        ON apl.card_id = card.id
      
      LEFT JOIN station AS st
        ON apl.station_id = st.id
        
      LEFT JOIN card_type AS ct
        ON card.type = ct.id
      
      WHERE ${
        WhereSearch(check_seach)
      }
      
      apl.access_time BETWEEN ? AND ?
    `
    const [length] = await conn.query(query_string_length,[ 
      start_time, stop_time,
    ])
    const query_string_list_person = `
      SELECT 

      apl.id as assambly_id,
      apl.access_time ,
      ps.firstname,
      ps.lastname,
      cn.name,
      card.id,
      card.type,
      st.name,
      ct.description AS card_type_desc,
      cn.name AS company,
      apl.station_id as station_id
      
      FROM assembly_point_log AS apl 
      
      
      LEFT JOIN person AS ps
        ON apl.person_id = ps.id
      
      LEFT JOIN company AS cn
        ON ps.company_id = cn.id
      
      LEFT JOIN card AS card
        ON apl.card_id = card.id
      
      LEFT JOIN station AS st
        ON apl.station_id = st.id
        
      LEFT JOIN card_type AS ct
        ON card.type = ct.id
      
      WHERE ${
        WhereSearch(check_seach)
      }
      
      apl.access_time BETWEEN ? AND ?
      
      
      ORDER BY ${check_sort_type(sort_type)} ${sort}

      LIMIT ${limit} OFFSET ${offset}
    `
    const [list_person] = await conn.query(query_string_list_person,[ 
      start_time, stop_time,
    ])
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
  FindLog
};