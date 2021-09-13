var mysql = require('../connection')
var mqtt = require("./lib/mqtt_multi_broker")
var config = require("./../db.mysql.config")

// // flow work
// 1. send mqttt
// 2. check message send success
// 3. insert and update is success message
// 4. send result to client

module.exports = async (data) => {
  const conn = await mysql.connection()
  var mqtt_setup = []
  var message_send_successfull = []
  try {
    // Check select assambly point
    if (data.assambly.length === 0) {
      return {
        isError: true,
        data: "คุณยังไม่ได้เลือกจุดรวมพล",
      }
    }

    // check message is used
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

    // Genarate topic mqtt
    data.assambly.forEach(element => {
      var topic = process.env.MQTTTOPIC_POINT_ALL.split("{{STATION_POINT}}")
      mqtt_setup.push({
        broker: element,
        topic: topic[0] + element + topic[1],
        message: data.message
      })
    });

    // send message to assambly point
    const mqtt_result = await mqtt(mqtt_setup)
    mqtt_result.forEach((e) => {
      if (e.status === true){
        message_send_successfull.push(e.assambly_id)
      }
    })

    // check send unsuccessfull
    if (message_send_successfull.length === 0){
      return {
        isError: false,
        data: 'ไม่สามารถส่งข้อมูลไปที่จุดรวมพลได้',
        mqtt: mqtt_result
      } 
    }


    // insert message sended successfull
    var query = `INSERT INTO message SET message = "${data.message}"`
    const [result] = await conn.query(query)
    var insertID = result.insertId

    // update group message
    var where = message_send_successfull.join()
    var when = ``
    message_send_successfull.forEach(element => {
      when += ` WHEN ${element} THEN ${insertID} 
      `
    });
    var query = `
      UPDATE group_message AS gm SET gm.group = CASE assambly_id
        ${when}
      ELSE assambly_id END
      WHERE assambly_id IN(${where});
    `
    const [update] = await conn.query(query)


    conn.end();
    return {
      isError: false,
      data: update,
      mqtt: mqtt_result
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