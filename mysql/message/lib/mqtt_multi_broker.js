const mqtt = require("mqtt")
var config = require("./../../db.mysql.config")

module.exports = async (mqtt_) => {

  return Promise.all(mqtt_.map(q => {
    try {
      var clientMQTT = mqtt.connect(process.env["MQTTIP_POINT_" + q.broker], {
        port: Number(process.env["MQTTPORT_POINT_" + q.broker]),
        host: process.env["MQTTIP_POINT_" + q.broker],
        clientId: process.env["MQTTCLIENTID_POINT_" + q.broker] + "_" + Math.random().toString(16).substr(2, 8),
        username: process.env["MQTTUSER_POINT_" + q.broker],
        password: process.env["MQTTPASS_POINT_" + q.broker],
        keepalive: 0,
        reconnectPeriod: 0,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        encoding: 'utf8'
      })

      return new Promise( (resolve, reject) => {

        var connect_timer = setTimeout(() => {
          resolve({
            assambly_id: q.broker,
            name: `Assambly_Point_${q.broker}`,
            status: false,
            message: "can't connect to broker."
          })
          console.log("=========================")
          console.log(`>> Offline << [Assambly_Point_${q.broker}]\n[Time: ${new Date()}]\nTopic: ${q.topic}\nMessage: ${q.message}\nstatus: "unsuccess"`)
          console.log("=========================")
        }, process.env.MQTTTIMOUT);

        clientMQTT.on('connect', () => {
          clearTimeout(connect_timer)
          clientMQTT.publish(q.topic, q.message)
          clientMQTT.end()
          console.log("=========================")
          console.log(`>> Online << [Assambly_Point_${q.broker}]\n[Time: ${new Date()}]\nTopic: ${q.topic}\nMessage: ${q.message}\nstatus: "success"`)
          console.log("=========================")
        })
        clientMQTT.on('end', function(){
          resolve( {
            assambly_id: q.broker,
            name: `Assambly_Point_${q.broker}`,
            status: true,
            message: "send message successed."
          })
        })
        clientMQTT.on('error', function(){
          console.log("=========================")
          console.log(`>> Online << [Assambly_Point_${q.broker}]\n[Time: ${new Date()}]\nTopic: ${q.topic}\nMessage: ${q.message}\nstatus: "unsuccess"`)
          console.log("=========================")
          clientMQTT.end()
          resolve({
            assambly_id: q.broker,
            name: `Assambly_Point_${q.broker}`,
            status: false,
            message: "can't connect to broker."
          })
        })
      })
    }catch (e) {
      return {
        status: false,
        message: e
      }
    }
  }));
}