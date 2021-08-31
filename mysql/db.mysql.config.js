module.exports = {
  db: process.env.DBSQL,
  host: process.env.SERVERSQL,
  user: process.env.USERSQL,
  pass: process.env.PASSSQL,
  mqtt: {
    ip: process.env.MQTTIP,
    port: process.env.MQTTPORT,
    user: process.env.MQTTUSER,
    pass: process.env.MQTTPASS,
    client_id: process.env.MQTTCLIENTID,
    main_topic: process.env.MQTTTOPIC
  }
};