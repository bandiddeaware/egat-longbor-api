var mysql = require('../connection')
var mqtt = require("./lib/mqtt")
var config = require("./../db.mysql.config")

async function fire_mqtt_all(mqtt_) {
  return Promise.all(mqtt_.map(q => {
    return mqtt(q.topic, q.message)
  }));
}

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
        var topic = config.mqtt.main_topic.split("{{STATION_POINT}}")
        mqtt_setup.push({
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

      const mqtt_result = await mqtt(mqtt_setup)
      if (mqtt_result.status){
        return {
          isError: false,
          data: update,
        } 
      }
    }

    conn.end();
    return {
      isError: false,
      data: group_msg,
    }
  }catch(e) {
    conn.end();
    return {
      isError: true,
      data: e
    }
  }
};