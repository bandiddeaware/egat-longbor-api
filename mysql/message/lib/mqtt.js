const mqtt = require("mqtt")
var config = require("./../../db.mysql.config")

module.exports = async (mqtt_) => {
  try {
    var clientMQTT = mqtt.connect(config.mqtt.ip, {
      port: Number(config.mqtt.port),
      host: config.mqtt.ip,
      clientId: config.mqtt.client_id + "_" + Math.random().toString(16).substr(2, 8),
      username: config.mqtt.user,
      password: config.mqtt.pass,
      keepalive: 60,
      reconnectPeriod: 1000,
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      clean: true,
      encoding: 'utf8'
    })
    clientMQTT.on('connect', () => {
      Promise.all(mqtt_.map(q => {
        console.log(`[${new Date()}] Topic: ${q.topic} Message: ${q.message}`)
        clientMQTT.publish(q.topic, q.message)
      }));
      clientMQTT.end()
    })
    return {
      status: true
    }
    // const result = await clientMQTT.publish(topic, message)
    // // clientMQTT.end()
  }catch (e) {
    return e
  }
}