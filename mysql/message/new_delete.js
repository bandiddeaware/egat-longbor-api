var mysql = require('../connection')
var mqtt = require("./lib/mqtt_multi_broker")
var config = require("./../db.mysql.config")

module.exports = async (data) => {
  const conn = await mysql.connection()
  try {

    var query = `SELECT COUNT(*) AS find_msg FROM message WHERE id = ${data.msg_id}`
    const [find_msg] = await conn.query(query)
    if (find_msg[0].find_msg === 0){
      return {
        isError: true,
        data: "ไม่พบไอดีกรุณาตรวจสอบข้อมูล",
      }
    }

    var mqtt_setup = []
    // find assambly and set item
    var query = `SELECT assambly_id FROM group_message WHERE group_message.group = ${data.msg_id}`
    const [find] = await conn.query(query)
    var ass_item = []
    find.forEach((item) => {
      ass_item.push(item.assambly_id)
    })

    if (ass_item.length > 0){
      var where = ass_item.join()
      var when = ``
      ass_item.forEach(element => {
        var topic = process.env.MQTTTOPIC_POINT_ALL.split("{{STATION_POINT}}")
        mqtt_setup.push({
          broker: element , 
          topic: topic[0] + element + topic[1],
          message: ""
        })
      });

      // clear data assambly point 
      const mqtt_result = await mqtt(mqtt_setup)
      var clear_msg_all = true
      var new_ass_item = []
      mqtt_result.forEach((e) => {
        if (e.status === true){
          new_ass_item.push(e.assambly_id)
        } else {
          clear_msg_all = false
        }
      })

      new_ass_item.forEach(element => {
        when += ` WHEN ${element} THEN NULL
        `
      });
      if (new_ass_item.length !== 0) {
        var query = `
          UPDATE group_message AS gm SET gm.group = CASE assambly_id
            ${when}
          ELSE assambly_id END
          WHERE assambly_id IN(${new_ass_item.join()});
        `
        const [update] = await conn.query(query)
      }

      // delete item
      if (clear_msg_all){
        var query = `DELETE FROM message WHERE id = ${data.msg_id}`
        const [result] = await conn.query(query)
      }

      return {
        isError: false,
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