var mysql = require('../connection')
var mqtt = require("./lib/mqtt_multi_broker")
var config = require("./../db.mysql.config")

module.exports = async (data) => {
  const conn = await mysql.connection()
  try {
    if (data.assambly.length === 0) {
      return {
        isError: true,
        data: "คุณยังไม่ได้เลือกจุดรวมพล",
      }
    }
    var query = `SELECT * FROM group_message WHERE group_message.assambly_id IN (${data.assambly.join()})`
    const [checkFeildGroup] = await conn.query(query)
    var isData = false
    checkFeildGroup.forEach((item) => {
      if (item.group !== null){
        isData = true
      }
    })
    if (isData){
      return {
        isError: true,
        data: "จุดรวมพลได้ถูกใช้กับประกาศอื่นแล้ว",
      }
    }
    var query = `INSERT INTO message SET message = "${data.message}"`
    const [result] = await conn.query(query)
    var insertID = result.insertId
    var mqtt_setup = []
    if (data.assambly.length > 0){
      var where = data.assambly.join()
      var when = ``
      data.assambly.forEach(element => {
        when += ` WHEN ${element} THEN ${insertID} 
        `
        var topic = process.env.MQTTTOPIC_POINT_ALL.split("{{STATION_POINT}}")
        mqtt_setup.push({
          broker: element,
          topic: topic[0] + element + topic[1],
          message: data.message
        })
      });
      var query = `
        UPDATE group_message AS gm SET gm.group = CASE assambly_id
          ${when}
        ELSE assambly_id END
        WHERE assambly_id IN(${where});
      `
      const [update] = await conn.query(query)

      // // fire mqtt to assambly point
      // async function find_assambly_point(conn, query) {
      //   return Promise.all(query.map(q => {
      //     return conn.query(q)
      //   }));
      // }
      const mqtt_result = await mqtt(mqtt_setup)
      return {
        isError: false,
        data: update,
        mqtt: mqtt_result
      } 
    }

    conn.end();
    return {
      isError: false,
      data: group_msg,
      mqtt: {}
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e,
      mqtt: {}
    }
  }
};