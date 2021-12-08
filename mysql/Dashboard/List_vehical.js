var mysql = require('../connection')

const FindLog = async (
  start_time, 
  stop_time,
  entrance_id,
  license_plate,
  province_id,
  province_name,
  company_id,
  company_name,
  ACCESS_GRANTED ,
  PERMISSION_DENIED ,
  CARD_EXPIRED ,
  INVALID_CHANNEL_TYPE ,
  CARD_NOT_ACTIVATED ,
  offset, 
  limit,
  sort,
  sort_type,
  direction,
) => {
  const conn = await mysql.connection()

  const check_sort_type = (sort_type) => {
    var query_sort = ''
    // acl.access_time AS time,
    // et.name AS entrace_name,
    // card.id AS card_id,
    if (sort_type === 'time'){
      query_sort = 'acl.access_time'
    }else if (sort_type === 'entrace_name'){
      query_sort = 'et.name'
    }else if (sort_type === 'card_id'){
      query_sort = 'card.id'
    } else if (sort_type === 'channel_id') {
      query_sort = 'acl.ch_id'
    } else {
      query_sort = 'acl.access_time'
    }
    return query_sort
  }

  const searchBy_entrance_license_company = (
    entrance_id,
    license_plate,
    province_id,
    province_name,
    company_id,
    company_name
  ) => {
    var query_out = ""
    var count = 0
    var q_arr = []
    if (entrance_id !== undefined) { q_arr.push(`acl.entrance_id = ${entrance_id}`); count++; }
    // if (license_plate !== undefined) { q_arr.push(`vh.license_plate = '${license_plate}'`); count++; }
    // if (province_id !== undefined) { q_arr.push(`vh.province_id = ${province_id}`); count++; }

    // if (license_plate !== undefined) { q_arr.push(`vh.license_plate LIKE '%${license_plate}%'`); count++; }

    // check by card
    // vh.license_plate LIKE '%${license_plate}%' OF vh.card_id LIKE '%${license_plate}%'
    if (license_plate !== undefined) { q_arr.push(`vh.license_plate LIKE '%${license_plate}%' OR vh.card_id LIKE '%${license_plate}%'`); count++; }
    
    if (province_name !== undefined) { q_arr.push(`pv.name_th LIKE '%${province_name}%'`); count++; }

    if (company_name !== undefined) { q_arr.push(`cn.name LIKE "%${company_name}%"`); count++; }
    if (q_arr.length === 0){
      return ''
    }
    for (var i = 0;i < (count);i++){
      query_out += `${q_arr[i]} ${(i !== count - 1 ? "AND": "")} `
    }
    return query_out
  }

  const searchBy_accDirection = (direction) => {
    if (direction !== undefined) { 
      return `acl.access_direction = ${direction} AND`
    }else {
      return ``
    }
  }

  // ACCESS_GRANTED = 0;
  // PERMISSION_DENIED = -1;
  // CARD_EXPIRED = -2;
  // NO_CARD_EXISTED = -3;
  // INVALID_CHANNEL_TYPE = -4;
  // CARD_NOT_ACTIVATED = -5;
  const searchBy_status = (
    ACCESS_GRANTED ,
    PERMISSION_DENIED ,
    CARD_EXPIRED ,
    INVALID_CHANNEL_TYPE ,
    CARD_NOT_ACTIVATED ,
  ) => {
    var query_out = ""
    var count = 0
    var q_arr = []
// ACCESS_GRANTED = 0;
// PERMISSION_DENIED = -1;
// CARD_EXPIRED = -2;
// NO_CARD_EXISTED = -3;
// INVALID_CHANNEL_TYPE = -4;
// CARD_NOT_ACTIVATED = -5;
// PASSBACK_VIOLATION = -6;
    if (ACCESS_GRANTED !== undefined) { q_arr.push(`acl.access_result = 0`); count++; }
    if (PERMISSION_DENIED !== undefined) { q_arr.push(`acl.access_result = -1`); count++; }
    if (CARD_EXPIRED !== undefined) { q_arr.push(`acl.access_result = -2`); count++; }
    if (INVALID_CHANNEL_TYPE !== undefined) { q_arr.push(`acl.access_result = -4`); count++; }
    if (CARD_NOT_ACTIVATED !== undefined) { q_arr.push(`acl.access_result = -5 `); count++; }

    // if (direction !== undefined) { q_arr.push(`1 AND acl.access_direction = ${direction}`); count++; }

    if (q_arr.length === 0){
      return ''
    }
    for (var i = 0;i < (count);i++){
      query_out += `${q_arr[i]} ${(i !== count - 1 ? " OR ": " ")} `
    }
    return query_out
  }
  const check_seach_1 = searchBy_status(
    ACCESS_GRANTED ,
    PERMISSION_DENIED ,
    CARD_EXPIRED ,
    INVALID_CHANNEL_TYPE ,
    CARD_NOT_ACTIVATED ,
  )
  const check_seach_2 = searchBy_entrance_license_company(
    entrance_id,
    license_plate,
    province_id,
    province_name,
    company_id,
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

      LEFT JOIN card as card
        ON acl.card_id = card.id
      
      LEFT JOIN station as et
        ON et.id = acl.entrance_id
      
      LEFT JOIN vehicle AS vh
        ON vh.id = acl.vehicle_id
      
      LEFT JOIN person_type AS pt
        ON vh.type = pt.id

      LEFT JOIN company as cn
        ON vh.company_id = cn.id
      
      LEFT JOIN tb_provinces as pv
        ON vh.province_id = pv.id

      LEFT JOIN vehicle_brand as vhb
        ON vh.model = vhb.id

      LEFT JOIN vehicle_classification as vhcl
        ON vh.classification = vhcl.id

      WHERE 
        (acl.ch_type = 1) AND

        ${
          WhereSearch(
            // check_seach_1, 
            check_seach_2
          )
        }

        ${(check_seach_1 ? " ( ": "")}

        ${
          searchBy_status(
            ACCESS_GRANTED ,
            PERMISSION_DENIED ,
            CARD_EXPIRED ,
            INVALID_CHANNEL_TYPE ,
            CARD_NOT_ACTIVATED ,
          )
        }

        ${(check_seach_1 ? ") AND ": "")}

        ${searchBy_accDirection(direction)}

        acl.access_time BETWEEN ? AND ?
    `
    const [length] = await conn.query(query_string_length,[ 
      start_time, stop_time,
    ])
    const query_string_list_vehicle = `
      SELECT 

      acl.id AS id, 
      acl.access_time AS time,
      et.name AS entrace_name,
      acl.access_direction AS direction,
      card.id AS card_id,
      
      vh.*,
      
      pt.description AS card_type,
      cn.name AS company_name,
      acl.access_result AS access_result,

      pv.name_th AS province_name,

      acl.entrance_id AS station_id,
      acl.ch_id AS channel_id,

      vhb.name as vehicle_brand,
      vhcl.type as vehicle_classification,

      vht.description as description

      FROM access_log as acl

      LEFT JOIN card as card
        ON acl.card_id = card.id
      
      LEFT JOIN station as et
        ON et.id = acl.entrance_id
      
      LEFT JOIN vehicle AS vh
        ON vh.id = acl.vehicle_id
      
      LEFT JOIN person_type AS pt
        ON vh.type = pt.id

      LEFT JOIN company as cn
        ON vh.company_id = cn.id
      
      LEFT JOIN tb_provinces as pv
        ON vh.province_id = pv.id

      LEFT JOIN vehicle_brand as vhb
        ON vh.model = vhb.id

      LEFT JOIN vehicle_classification as vhcl
        ON vh.classification = vhcl.id
      
      LEFT JOIN vehicle_type as vht
        ON vht.id = vh.type

      WHERE 
        (acl.ch_type = 1) AND
        
        ${
          WhereSearch(
            // check_seach_1, 
            check_seach_2
          )
        }

        ${(check_seach_1 ? " ( ": "")}

        ${
          searchBy_status(
            ACCESS_GRANTED ,
            PERMISSION_DENIED ,
            CARD_EXPIRED ,
            INVALID_CHANNEL_TYPE ,
            CARD_NOT_ACTIVATED ,
          )
        }

        ${(check_seach_1 ? ") AND ": "")}

        ${searchBy_accDirection(direction)}

        acl.access_time BETWEEN ? AND ?
      
      
      ORDER BY ${check_sort_type(sort_type)} ${sort}
      
      LIMIT ${limit} OFFSET ${offset}
    `
    const [list_vehicle] = await conn.query(query_string_list_vehicle,[ 
      start_time, stop_time,
    ])
    conn.end();
    return {
      isError: false,
      data: list_vehicle,
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