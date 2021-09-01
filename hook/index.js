var axios = require('axios');
var qs = require('qs');
var mysql = require('../mysql/connection')
var parseDateTime = require('../commons/parseDateTime')

const login = async (user, pass) => {
  var data = qs.stringify({
    'action': process.env.HOOK_ACTION ,
    'akey': process.env.HOOK_AKEY,
    'eno': user,
    'pwd': pass,
    'ip': process.env.HOOK_IP,
    'type': process.env.HOOK_TYPE,
  });
  var config = {
    method: 'post',
    url: process.env.HOOK_URL,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  let res
  try{
    res = await axios(config)
  }catch(e){
    res = e.response
  }
  return res
}

const hookHR = async (mifare) => {
  var config = {
    method: 'get',
    url: process.env.HOOKHR_URL + `?filter[RFIDCode]=${mifare}&include=person`,
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'Authorization': process.env.HOOKHR_TOKEN
    },
  };
  let res
  try{
    res = await axios(config)
  }catch(e){
    res = e.response
  }
  if (res.data.data.length === 0){
    return {data: {
      data: res.data,
      message: "not found person",
    }}
  }

  try {
    var update = {
      egat_code: res.data.data[0].person_code.substr(2),
      title: res.data.data[0].person.person_thai_prefix_name,
      firstname: res.data.data[0].person.person_thai_thai_firstname,
      lastname: res.data.data[0].person.person_thai_thai_lastname,
    }
    const conn = await mysql.connection()

    const [check_person] = await conn.query(`SELECT COUNT(*) AS checked FROM person WHERE person.egat_person_code = ${update.egat_code}`)
    if (check_person[0].checked === 0){
      var query = `
        INSERT INTO person SET 
          name_title = "${update.title}",
          sex = "${(update.title === "นาย" ? "ชาย": (update.title === "นาง" || update.title === "นางสาว" ? "หญิง": ""))}",
          firstname = "${update.firstname}",
          lastname = "${update.lastname}",
          egat_person_code = "${update.egat_code}",
          picture = "${update.egat_code}.jpg",
          company_id = 0,
          type = 1,
          created_at = "${parseDateTime(new Date())}",
          modified_at = "${parseDateTime(new Date())}",
          mine_permit = 1
      `
      console.log(query)
      const [insert_person] = await conn.query(query)
      if (insert_person.affectedRows === 1){
        var res__ = {}
        res__.data = {
          data: res.data,
          message: "insert person successed",
        }
        return res__
      }
    }
  }catch (e){
    var res__ = {}
    res__.data = e
    return res__
  }
  
  var res__ = {}
  res__.data = {
    data: res.data,
    message: "person already have",
  }
  return res__
}

module.exports = {
  login,
  hookHR
};