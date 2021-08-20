var mysql = require('../connection')

const TatalPersonVehicle = async (
  start_time, 
  end_time
) => {
  const conn = await mysql.connection()

  try {
    // Total
    const [summary] = await conn.query(`
      SELECT 
        IF(p_in IS NULL, 0,  p_in) AS  p_in, 
        IF(p_out IS NULL, 0, p_out) AS p_out, 
        IF(c_in IS NULL, 0, c_in) AS c_in, 
        IF(c_out IS NULL, 0, c_out) AS c_out
      FROM (
        SELECT
          SUM(IF(access_direction = 0 && access_type = 1, 1, 0)) AS p_in,
          SUM(IF(access_direction = 1 && access_type = 1, 1, 0)) AS p_out,
          SUM(IF(access_direction = 0 && access_type = 2, 1, 0)) AS c_in,
          SUM(IF(access_direction = 1 && access_type = 2, 1, 0)) AS c_out
        FROM access_log
        WHERE access_result = 0 AND access_time BETWEEN ? AND ?
      ) AS filter_null
    `,[ 
      start_time, end_time
    ])

    const [ summary_gate_1 ] = await conn.query(`
      SELECT 
        IF(p_in IS NULL, 0,  p_in) AS  p_in, 
        IF(p_out IS NULL, 0, p_out) AS p_out, 
        IF(c_in IS NULL, 0, c_in) AS c_in, 
        IF(c_out IS NULL, 0, c_out) AS c_out
      FROM (
        SELECT
          SUM(IF(access_direction = 0 && access_type = 1 && entrance_id = 1, 1, 0)) AS p_in,
          SUM(IF(access_direction = 1 && access_type = 1 && entrance_id = 1, 1, 0)) AS p_out,
          SUM(IF(access_direction = 0 && access_type = 2 && entrance_id = 1, 1, 0)) AS c_in,
          SUM(IF(access_direction = 1 && access_type = 2 && entrance_id = 1, 1, 0)) AS c_out
        FROM access_log
        WHERE access_result = 0 AND access_time BETWEEN ? AND ?
      ) AS filter_null
    `,[ 
      start_time, end_time,
    ])

    const [ summary_gate_2 ] = await conn.query(`
      SELECT 
        IF(p_in IS NULL, 0,  p_in) AS  p_in, 
        IF(p_out IS NULL, 0, p_out) AS p_out, 
        IF(c_in IS NULL, 0, c_in) AS c_in, 
        IF(c_out IS NULL, 0, c_out) AS c_out
      FROM (
        SELECT
        SUM(IF(access_direction = 0 && access_type = 1 && entrance_id = 2, 1, 0)) AS p_in,
        SUM(IF(access_direction = 1 && access_type = 1 && entrance_id = 2, 1, 0)) AS p_out,
        SUM(IF(access_direction = 0 && access_type = 2 && entrance_id = 2, 1, 0)) AS c_in,
        SUM(IF(access_direction = 1 && access_type = 2 && entrance_id = 2, 1, 0)) AS c_out
      FROM access_log
      WHERE access_result = 0 AND access_time BETWEEN ? AND ?
      ) AS filter_null
    `,[ 
      start_time, end_time
    ])

    const [ summary_gate_3 ] = await conn.query(`
      SELECT 
        IF(p_in IS NULL, 0,  p_in) AS  p_in, 
        IF(p_out IS NULL, 0, p_out) AS p_out, 
        IF(c_in IS NULL, 0, c_in) AS c_in, 
        IF(c_out IS NULL, 0, c_out) AS c_out
      FROM (
        SELECT
          SUM(IF(access_direction = 0 && access_type = 1 && entrance_id = 3, 1, 0)) AS p_in,
          SUM(IF(access_direction = 1 && access_type = 1 && entrance_id = 3, 1, 0)) AS p_out,
          SUM(IF(access_direction = 0 && access_type = 2 && entrance_id = 3, 1, 0)) AS c_in,
          SUM(IF(access_direction = 1 && access_type = 2 && entrance_id = 3, 1, 0)) AS c_out
        FROM access_log
        WHERE access_result = 0 AND access_time BETWEEN ? AND ?
      ) AS filter_null
    `,[ 
      start_time, end_time
    ])

    const [ summary_gate_4 ] = await conn.query(`
      SELECT 
        IF(p_in IS NULL, 0,  p_in) AS  p_in, 
        IF(p_out IS NULL, 0, p_out) AS p_out, 
        IF(c_in IS NULL, 0, c_in) AS c_in, 
        IF(c_out IS NULL, 0, c_out) AS c_out
      FROM (
        SELECT
          SUM(IF(access_direction = 0 && access_type = 1 && entrance_id = 4, 1, 0)) AS p_in,
          SUM(IF(access_direction = 1 && access_type = 1 && entrance_id = 4, 1, 0)) AS p_out,
          SUM(IF(access_direction = 0 && access_type = 2 && entrance_id = 4, 1, 0)) AS c_in,
          SUM(IF(access_direction = 1 && access_type = 2 && entrance_id = 4, 1, 0)) AS c_out
        FROM access_log
        WHERE access_result = 0 AND access_time BETWEEN ? AND ?
      ) AS filter_null
    `,[ 
      start_time, end_time
    ])

    const query_string_length = `
      SELECT 
    
        COUNT(*) AS LENGTH

      FROM person AS ps 

      LEFT JOIN card AS card
        ON ps.card_id = card.id

      LEFT JOIN card_status AS card_st
        ON card.status = card_st.id

      LEFT JOIN company AS cp
        ON cp.id = ps.company_id

      WHERE
        ps.check_in_at > ps.check_out_at AND 
        
        ps.check_in_at IS NOT NULL AND 
        ps.check_out_at IS NOT NULL AND
        ps.asbp_checked_at IS NOT NULL AND 

        ps.card_id IS NOT NULL
    `
    const [length] = await conn.query(query_string_length)

    
    summary_gate_1[0].name = 'ด่านหลัก 1'
    summary_gate_1[0].station_id = 1
    summary_gate_2[0].name = 'ด่านหลัก 2'
    summary_gate_2[0].station_id = 2
    summary_gate_3[0].name = 'ด่านหลัก 3'
    summary_gate_3[0].station_id = 3
    summary_gate_4[0].name = 'ด่านสายพาน'
    summary_gate_4[0].station_id = 4
    summary[0].postion = [summary_gate_1[0], summary_gate_2[0], summary_gate_3[0], summary_gate_4[0],]
    console.log(length[0])
    summary[0].in_point = length[0].LENGTH
    conn.end();
    return {
      isError: false,
      data: summary,
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
  TatalPersonVehicle
};

// var mysql = require('../connection')

// const TatalPersonVehicle = async (
//   start_time, 
//   end_time
// ) => {
//   const conn = await mysql.connection()

//   try {
//     // Total
//     const [summary] = await conn.query(`
//       SELECT  (

//         SELECT COUNT(*)
//         FROM access_log as acl
    
//         WHERE acl.access_type = 1 AND acl.access_direction = 0 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? 
      
//       ) AS p_in, (
      
//         SELECT COUNT(*)
//         FROM access_log as acl
      
//         WHERE acl.access_type = 1 AND acl.access_direction = 1 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ?
      
//       ) AS p_out, (
      
//         SELECT COUNT(*)
//         FROM access_log as acl
    
//         WHERE acl.access_type = 2 AND acl.access_direction = 0 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ?
      
//       ) AS c_in, (
      
//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 2 AND acl.access_direction = 1 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ?
      
//       ) AS c_out
//     `,[ 
//       start_time, end_time, 
//       start_time, end_time, 
//       start_time, end_time, 
//       start_time, end_time  
//     ])

//     const [ summary_gate_1 ] = await conn.query(`
//       SELECT  (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 1 AND acl.access_direction = 0 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?
      
//       ) AS p_in, (
      
//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 1 AND acl.access_direction = 1 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?
      
//       ) AS p_out, (
      
//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 2 AND acl.access_direction = 0 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?
      
//       ) AS c_in, (
      
//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 2 AND acl.access_direction = 1 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?
      
//       ) AS c_out
//     `,[ 
//       start_time, end_time, 1,
//       start_time, end_time, 1,
//       start_time, end_time, 1,
//       start_time, end_time, 1, 
//     ])

//     const [ summary_gate_2 ] = await conn.query(`
//       SELECT  (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 1 AND acl.access_direction = 0 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS p_in, (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 1 AND acl.access_direction = 1 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS p_out, (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 2 AND acl.access_direction = 0 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS c_in, (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 2 AND acl.access_direction = 1 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS c_out
//     `,[ 
//       start_time, end_time, 2,
//       start_time, end_time, 2,
//       start_time, end_time, 2,
//       start_time, end_time, 2, 
//     ])

//     const [ summary_gate_3 ] = await conn.query(`
//       SELECT  (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 1 AND acl.access_direction = 0 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS p_in, (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 1 AND acl.access_direction = 1 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS p_out, (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 2 AND acl.access_direction = 0 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS c_in, (

//         SELECT COUNT(*)
//         FROM access_log as acl

//         WHERE acl.access_type = 2 AND acl.access_direction = 1 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS c_out
//     `,[ 
//       start_time, end_time, 3,
//       start_time, end_time, 3,
//       start_time, end_time, 3,
//       start_time, end_time, 3, 
//     ])

//     const [ summary_gate_4 ] = await conn.query(`
//       SELECT  (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 1 AND acl.access_direction = 0 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS p_in, (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 1 AND acl.access_direction = 1 AND acl.person_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS p_out, (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 2 AND acl.access_direction = 0 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS c_in, (

//         SELECT COUNT(*)
//         FROM access_log as acl
        
//         WHERE acl.access_type = 2 AND acl.access_direction = 1 AND acl.vehicle_id IS NOT NULL AND
//         acl.access_time BETWEEN ? AND ? AND entrance_id = ?

//       ) AS c_out
//     `,[ 
//       start_time, end_time, 4,
//       start_time, end_time, 4,
//       start_time, end_time, 4,
//       start_time, end_time, 4, 
//     ])

//     summary_gate_1[0].name = 'ด่านหลัก 1'
//     summary_gate_2[0].name = 'ด่านหลัก 2'
//     summary_gate_3[0].name = 'ด่านหลัก 3'
//     summary_gate_4[0].name = 'ด่านสายพาน'
//     summary[0].postion = [summary_gate_1[0], summary_gate_2[0], summary_gate_3[0], summary_gate_4[0],]

//     conn.end();
//     return {
//       isError: false,
//       data: summary,
//     }
//   }catch(e) {
//     conn.end();
//     return {
//       isError: true,
//       data: e
//     }
//   }
// }

// module.exports = {
//   TatalPersonVehicle
// };