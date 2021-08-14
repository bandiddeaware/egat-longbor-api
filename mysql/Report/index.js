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

module.exports = {
  summary_day
};