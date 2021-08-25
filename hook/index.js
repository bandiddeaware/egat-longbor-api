var axios = require('axios');
var qs = require('qs');

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

module.exports = {
  login
};