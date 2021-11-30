var mysql = require('../connection')
var _ = require('underscore')

var check_time = 1

const summary_day = async (
  start_date, stop_date
) => {
  const conn = await mysql.connection()

  try {
    const [access_summary] = await conn.query(`
      SELECT * FROM access_summary

      WHERE date BETWEEN ? AND ?

      ORDER BY date ASC
    `,[ 
      start_date, stop_date
    ])
    
    conn.end();

    return {
      isError: false,
      data: access_summary,
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e
    }
  }
}

// report all day
const report_all_day = async (
  start_date, stop_date
) => {
  const conn = await mysql.connection()

  try {
    const [all_day] = await conn.query(`
      SELECT 

        SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 1 && (ch_type = 0),1, 0)) AS person_in_gate_1_barier,
        SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 1 && (ch_type = 0),1, 0)) AS person_out_gate_1_barier,
      
        SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 1 && (ch_type = 1),1, 0)) AS person_in_gate_1_vehicle,
        SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 1 && (ch_type = 1),1, 0)) AS person_out_gate_1_vehicle,
      
      
        SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 2 && (ch_type = 0),1, 0)) AS person_in_gate_2_barier,
        SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 2 && (ch_type = 0),1, 0)) AS person_out_gate_2_barier,
      
        SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 2 && (ch_type = 1),1, 0)) AS person_in_gate_2_vehicle,
        SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 2 && (ch_type = 1),1, 0)) AS person_out_gate_2_vehicle,
      
      
        SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 3 && (ch_type = 0),1, 0)) AS person_in_gate_3_barier,
        SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 3 && (ch_type = 0),1, 0)) AS person_out_gate_3_barier,
      
        SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 3 && (ch_type = 1),1, 0)) AS person_in_gate_3_vehicle,
        SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 3 && (ch_type = 1),1, 0)) AS person_out_gate_3_vehicle,
      
      
      
        SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 4 && (ch_type = 0),1, 0)) AS person_in_gate_4_barier,
        SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 4 && (ch_type = 0),1, 0)) AS person_out_gate_4_barier,
      
        SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 4 && (ch_type = 1),1, 0)) AS person_in_gate_4_vehicle,
        SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 4 && (ch_type = 1),1, 0)) AS person_out_gate_4_vehicle,
        
      access_time

      FROM access_log
      
      WHERE 1
      
      GROUP BY CAST(access_time AS DATE)
    `)
    
    conn.end();

    return {
      isError: false,
      data: all_day,
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e
    }
  }
}



// report all day
const report_all_month = async (
  start_date, stop_date
) => {
  const conn = await mysql.connection()

  try {
    const [all_month] = await conn.query(`
      SELECT

          SUM(person_in_gate_1_barier) AS person_in_gate_1_barier_month,
          SUM(person_out_gate_1_barier) AS person_out_gate_1_barier_month,
          SUM(person_in_gate_1_vehicle) AS person_in_gate_1_vehicle_mouth,
          SUM(person_out_gate_1_vehicle) AS person_out_gate_1_vehicle_month,

          SUM(person_in_gate_2_barier) AS person_in_gate_2_barier_month,
          SUM(person_out_gate_2_barier) AS person_out_gate_2_barier_month,
          SUM(person_in_gate_2_vehicle) AS person_in_gate_2_vehicle_mouth,
          SUM(person_out_gate_2_vehicle) AS person_out_gate_2_vehicle_month,

          SUM(person_in_gate_3_barier) AS person_in_gate_3_barier_month,
          SUM(person_out_gate_3_barier) AS person_out_gate_3_barier_month,
          SUM(person_in_gate_3_vehicle) AS person_in_gate_3_vehicle_mouth,
          SUM(person_out_gate_3_vehicle) AS person_out_gate_3_vehicle_month,

          SUM(person_in_gate_4_barier) AS person_in_gate_4_barier_month,
          SUM(person_out_gate_4_barier) AS person_out_gate_4_barier_month,
          SUM(person_in_gate_4_vehicle) AS person_in_gate_4_vehicle_mouth,
          SUM(person_out_gate_4_vehicle) AS person_out_gate_4_vehicle_month,

          time

      FROM (

      SELECT 

            SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 1 && (ch_type = 0),1, 0)) AS person_in_gate_1_barier,
            SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 1 && (ch_type = 0),1, 0)) AS person_out_gate_1_barier,
          
            SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 1 && (ch_type = 1),1, 0)) AS person_in_gate_1_vehicle,
            SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 1 && (ch_type = 1),1, 0)) AS person_out_gate_1_vehicle,
          
          
            SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 2 && (ch_type = 0),1, 0)) AS person_in_gate_2_barier,
            SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 2 && (ch_type = 0),1, 0)) AS person_out_gate_2_barier,
          
            SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 2 && (ch_type = 1),1, 0)) AS person_in_gate_2_vehicle,
            SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 2 && (ch_type = 1),1, 0)) AS person_out_gate_2_vehicle,
          
          
            SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 3 && (ch_type = 0),1, 0)) AS person_in_gate_3_barier,
            SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 3 && (ch_type = 0),1, 0)) AS person_out_gate_3_barier,
          
            SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 3 && (ch_type = 1),1, 0)) AS person_in_gate_3_vehicle,
            SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 3 && (ch_type = 1),1, 0)) AS person_out_gate_3_vehicle,
          
          
          
            SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 4 && (ch_type = 0),1, 0)) AS person_in_gate_4_barier,
            SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 4 && (ch_type = 0),1, 0)) AS person_out_gate_4_barier,
          
            SUM(IF(access_direction=0 && access_type = 1 && access_result = 0 && entrance_id = 4 && (ch_type = 1),1, 0)) AS person_in_gate_4_vehicle,
            SUM(IF(access_direction=1 && access_type = 1 && access_result = 0 && entrance_id = 4 && (ch_type = 1),1, 0)) AS person_out_gate_4_vehicle,
            
          access_time AS time

          FROM access_log
          
          WHERE 1
          
          GROUP BY CAST(access_time AS DATE)

      ) AS sksksksksks

      WHERE 1 

      GROUP BY MONTH(time)
    `)
    
    conn.end();

    return {
      isError: false,
      data: all_month,
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
  summary_day,
  report_all_day,
  report_all_month
};