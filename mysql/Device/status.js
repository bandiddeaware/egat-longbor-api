var mysql = require('../connection')
var _ = require('underscore')

var check_time = 5

const check_status = (time) => {
  var now = new Date().getTime()
  var time_dv = new Date(time).getTime()
  var status = (( (time_dv - now) < (-(check_time * 60) * 1000)) ? "offline": "online")
  return status
}

const Status = async () => {
  const conn = await mysql.connection()

  try {
    // Total
    const [entrance] = await conn.query(`
      SELECT * FROM station WHERE ?
    `,[ 
      1
    ])
    const [status] = await conn.query(`
      SELECT 

        et.id AS et_id, 
        et.name AS et_name,
        et.type AS et_type,
        et.lat AS et_lat,
        et.long AS et_long,
        dv.id AS dv_id,
        dv.name AS dv_name,
        dv.last_update AS dv_lasttime,
        dv.network_addr as addr

      FROM station AS et
      
      LEFT JOIN device AS dv
        ON et.id = dv.station_id
      
      WHERE ?

    `,[ 
      1
    ])

    // var grouped = _.groupBy(status, 'et_id')

    var new_data = []
    entrance.forEach((et_item, et_index) => {
      var findd_device = _.where(status, {et_id: et_item.id})
      var findd_device_new_map = findd_device.map((item, index) => {
        return {
          device_id: item.dv_id,
          device_name: item.dv_name,
          device_status: check_status(item.dv_lasttime),
          device_lasttime: item.dv_lasttime
        }
      })
      new_data.push({
        station_id: et_item.id,
        station_name: et_item.name,
        station_type: et_item.type,
        station_lat: et_item.lat,
        station_long: et_item.long,
        station_status: check_status(et_item.lasttime),
        station_lasttime: et_item.lasttime,
        device: _.sortBy(findd_device_new_map, "device_id")
      })
    })
    
    conn.end();

    return {
      isError: false,
      data: new_data,
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
  Status
};