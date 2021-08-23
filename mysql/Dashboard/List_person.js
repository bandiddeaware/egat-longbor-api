var mysql = require('../connection')

const FindLog = async (
  start_time, 
  stop_time,
  entrance_id,
  firstname,
  lastname,
  company_id,
  company_name,
  ACCESS_GRANTED ,
  PERMISSION_DENIED ,
  CARD_EXPIRED ,
  NO_CARD_EXISTED,
  INVALID_CHANNEL_TYPE ,
  CARD_NOT_ACTIVATED ,
  PASSBACK_VIOLATION,
  NOT_AVAILABLE_SYS,
  offset, 
  limit,
  sort,
  sort_type,
  direction,
) => {
  const conn = await mysql.connection()

  const check_sort_type = (sort_type) => {
    var query_sort = ''
    // time
    // entrace_name
    // card_id
    // name
    // card_type
    if (sort_type === 'time'){
      query_sort = 'acl.access_time'
    }else if (sort_type === 'entrace_name'){
      query_sort = 'et.name'
    }else if (sort_type === 'card_id'){
      query_sort = 'card.id'
    }else if (sort_type === 'name'){
      query_sort = 'ps.firstname'
    }else if (sort_type === 'card_type'){
      query_sort = 'pt.description'
    } else {
      query_sort = 'acl.access_time'
    }
    return query_sort
  }
  const searchBy_entrance_name_company = (
    entrance_id,
    firstname,
    lastname,
    company_name
  ) => {
    var query_out = ""
    var count = 0
    var q_arr = []
    if (entrance_id !== undefined) { q_arr.push(`acl.entrance_id = ${entrance_id}`); count++; }
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
  // ACCESS_GRANTED = 0;
  // PERMISSION_DENIED = -1;
  // CARD_EXPIRED = -2;
  // NO_CARD_EXISTED = -3;
  // INVALID_CHANNEL_TYPE = -4;
  // CARD_NOT_ACTIVATED = -5;
  // PASSBACK_VIOLATION = -6
  // NOT_AVAILABLE_SYS = NULL
  const searchBy_status = (
    ACCESS_GRANTED , // ผ่าน
    PERMISSION_DENIED , // ไม่อนุญาต
    CARD_EXPIRED , // บัตรหมดอายุ
    NO_CARD_EXISTED, // บัตรไม่มีอยู่
    INVALID_CHANNEL_TYPE , // ประเภทช่องไม่ถูกต้อง
    CARD_NOT_ACTIVATED , // บัตรไม่ได้เปิดใช้งาน
    PASSBACK_VIOLATION, // ส่งต่อการละเมิด
    NOT_AVAILABLE_SYS, // ไม่มีอยู่ในระบบ
  ) => {
    var query_out = ""
    var count = 0
    var q_arr = []
    if (ACCESS_GRANTED !== undefined) { q_arr.push(`acl.access_result = 0`        + (direction !== undefined ? ` AND acl.access_direction = ${direction} `: ``) ); count++; }
    if (PERMISSION_DENIED !== undefined) { q_arr.push(`acl.access_result = -1`    + (direction !== undefined ? ` AND acl.access_direction = ${direction} `: ``) ); count++; }
    if (CARD_EXPIRED !== undefined) { q_arr.push(`acl.access_result = -2`         + (direction !== undefined ? ` AND acl.access_direction = ${direction} `: ``) ); count++; }
    if (NO_CARD_EXISTED !== undefined) { q_arr.push(`acl.access_result = -3`      + (direction !== undefined ? ` AND acl.access_direction = ${direction} `: ``) ); count++; }
    if (INVALID_CHANNEL_TYPE !== undefined) { q_arr.push(`acl.access_result = -4` + (direction !== undefined ? ` AND acl.access_direction = ${direction} `: ``) ); count++; }
    if (CARD_NOT_ACTIVATED !== undefined) { q_arr.push(`acl.access_result = -5`   + (direction !== undefined ? ` AND acl.access_direction = ${direction} `: ``) ); count++; }

    if (PASSBACK_VIOLATION !== undefined) { q_arr.push(`acl.access_result = -6`   + (direction !== undefined ? ` AND acl.access_direction = ${direction} `: ``) ); count++; }
    if (NOT_AVAILABLE_SYS !== undefined) { q_arr.push(`acl.access_result IS NULL` + (direction !== undefined ? ` AND acl.access_direction = ${direction} `: ``) ); count++; }

    if (q_arr.length === 0){
      return ''
    }
    for (var i = 0;i < (count);i++){
      query_out += `${q_arr[i]} ${(i !== count - 1 ? "OR": "")} `
    }
    return query_out
  }
  const check_seach_1 = searchBy_status(
    ACCESS_GRANTED ,
    PERMISSION_DENIED ,
    CARD_EXPIRED ,
    NO_CARD_EXISTED,
    INVALID_CHANNEL_TYPE ,
    CARD_NOT_ACTIVATED ,
    PASSBACK_VIOLATION,
    NOT_AVAILABLE_SYS,
  )
  const check_seach_2 = searchBy_entrance_name_company(
    entrance_id,
    firstname,
    lastname,
    company_name
  )
  const WhereSearch = (
    // check_seach_1,
    check_seach_2
  ) => {
    var search = ''
    // if (check_seach_1 === ''){
    //   search = ' '
    // }else {
    //   search += check_seach_1 + " AND "
    // }
    if (check_seach_2 === ''){
      search = ' '
    } else {
      search += check_seach_2 + " AND "
    }
    return search
  }
  try {
    const query_string_length = `
      SELECT 

        COUNT(*) as LENGTH

      FROM access_log as acl
      
      LEFT JOIN person as ps
        ON acl.person_id = ps.id
      
      LEFT JOIN company as cn
        ON ps.company_id = cn.id
      
      LEFT JOIN card as card
        ON acl.card_id = card.id
      
      LEFT JOIN person_type AS pt
        ON ps.type = pt.id
      
      LEFT JOIN station as et
        ON et.id = acl.entrance_id
      
      WHERE 
        (acl.access_type = 1 OR acl.access_type = 0) AND

        ${ WhereSearch(
          // check_seach_1,
          check_seach_2
        ) }

        ${(check_seach_1 ? " ( ": "")}

        ${searchBy_status(
          ACCESS_GRANTED ,
          PERMISSION_DENIED ,
          CARD_EXPIRED ,
          NO_CARD_EXISTED,
          INVALID_CHANNEL_TYPE ,
          CARD_NOT_ACTIVATED ,
          PASSBACK_VIOLATION,
          NOT_AVAILABLE_SYS,
        )}

        ${(check_seach_1 ? ") AND ": "")}

        acl.access_time BETWEEN ? AND ?
    `
    const [length] = await conn.query(query_string_length,[ 
      start_time, stop_time,
    ])
    const query_string_list_person = `
      SELECT 

        acl.id AS id, 
        acl.access_time AS time,
        et.name AS entrace_name,
        acl.access_direction AS direction,
        card.id AS card_id,
        ps.firstname AS name,
        ps.lastname AS surname,
        pt.description AS card_type,
        cn.name AS company_name,
        acl.access_result AS access_result,
        acl.entrance_id AS station_id

      FROM access_log as acl
      
      LEFT JOIN person as ps
        ON acl.person_id = ps.id
      
      LEFT JOIN company as cn
        ON ps.company_id = cn.id
      
      LEFT JOIN card as card
        ON acl.card_id = card.id
      
      LEFT JOIN person_type AS pt
        ON ps.type = pt.id
      
      LEFT JOIN station as et
        ON et.id = acl.entrance_id
      
      WHERE 
        (acl.access_type = 1 OR acl.access_type = 0) AND

        ${ WhereSearch(
          // check_seach_1,
          check_seach_2
        ) }

        ${(check_seach_1 ? " ( ": "")}

        ${searchBy_status(
          ACCESS_GRANTED ,
          PERMISSION_DENIED ,
          CARD_EXPIRED ,
          NO_CARD_EXISTED,
          INVALID_CHANNEL_TYPE ,
          CARD_NOT_ACTIVATED ,
          PASSBACK_VIOLATION,
          NOT_AVAILABLE_SYS,
        )}

        ${(check_seach_1 ? ") AND ": "")}

        acl.access_time BETWEEN ? AND ?
      
      ORDER BY ${check_sort_type(sort_type)}  ${sort}

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