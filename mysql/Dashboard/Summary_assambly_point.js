var mysql = require('../connection')

const TatalPerson = async (
  start_time, 
  end_time
) => {
  const conn = await mysql.connection()

  try {
    const [ summary_assam ] = await conn.query(`
    
      SELECT 
        IF(assambly_st_5 IS NULL, 0, assambly_st_5) AS assembly_point_station_1,
        IF(assambly_st_6 IS NULL, 0, assambly_st_6) AS assembly_point_station_2,
        IF(assambly_st_7 IS NULL, 0, assambly_st_7) AS assembly_point_station_3,
        IF(assambly_st_8 IS NULL, 0, assambly_st_8) AS assembly_point_station_4,
        IF(assambly_st_9 IS NULL, 0, assambly_st_9) AS assembly_point_station_5,
        IF(assambly_st_10 IS NULL, 0, assambly_st_10) AS assembly_point_station_6
      FROM (

          SELECT 
            SUM(IF(apl.station_id = 5, 1, 0)) AS assambly_st_5
          FROM 
            assembly_point_log AS apl 
          WHERE 	
            apl.access_time BETWEEN ? AND ?
            
        ) AS assembly_point_station_1, (
        
          SELECT 
            SUM(IF(apl.station_id = 6, 1, 0)) AS assambly_st_6
          FROM 
            assembly_point_log AS apl 
          WHERE 	
            apl.access_time BETWEEN ? AND ?
            
        ) AS assembly_point_station_2, (
        
          SELECT 
            SUM(IF(apl.station_id = 7, 1, 0)) AS assambly_st_7
          FROM 
            assembly_point_log AS apl 
          WHERE 	
            apl.access_time BETWEEN ? AND ?
        
        ) AS assembly_point_station_3, (
        
          SELECT 
            SUM(IF(apl.station_id = 8, 1, 0)) AS assambly_st_8
          FROM 
            assembly_point_log AS apl 
          WHERE 	
            apl.access_time BETWEEN ? AND ?
        
        ) AS assembly_point_station_4, (
        
          SELECT 
            SUM(IF(apl.station_id = 9, 1, 0)) AS assambly_st_9
          FROM 
            assembly_point_log AS apl 
          WHERE 	
            apl.access_time BETWEEN ? AND ?
        
        ) AS assembly_point_station_5, (
        
          SELECT 
            SUM(IF(apl.station_id = 10, 1, 0)) AS assambly_st_10
          FROM 
            assembly_point_log AS apl 
          WHERE 	
            apl.access_time BETWEEN ? AND ?
        
        ) AS assembly_point_station_6

    `,[ 
      start_time, end_time, 
      start_time, end_time,
      start_time, end_time,
      start_time, end_time,
      start_time, end_time,
      start_time, end_time,
    ])
    var list = [
      {
        assambly_name: "จุดรวมพล 1",
        station_id: 5,
        assambly_total: summary_assam[0].assembly_point_station_1
      },{
        assambly_name: "จุดรวมพล 2",
        station_id: 6,
        assambly_total: summary_assam[0].assembly_point_station_2
      },{
        assambly_name: "จุดรวมพล 3",
        station_id: 7,
        assambly_total: summary_assam[0].assembly_point_station_3
      },{
        assambly_name: "จุดรวมพล 4",
        station_id: 8,
        assambly_total: summary_assam[0].assembly_point_station_4
      },{
        assambly_name: "จุดรวมพล 5",
        station_id: 9,
        assambly_total: summary_assam[0].assembly_point_station_5
      },{
        assambly_name: "จุดรวมพล 6",
        station_id: 10,
        assambly_total: summary_assam[0].assembly_point_station_6
      },
    ]
    conn.end();
    return {
      isError: false,
      data: list,
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
  TatalPerson
};