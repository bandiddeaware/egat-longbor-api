var router = require('express').Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var Auth = require("./../../../mysql/Auth/new_login")

router.post('/login_new', async function(req, res, next) {

  if(!req.body.username){
    return res.status(400).json({errors: {message: "username can't be blank"}});
  }

  if(!req.body.password){
    return res.status(400).json({errors: {message: "password can't be blank"}});
  }
  const result = await Auth.login(req.body.username, req.body.password)
  if (result.isError === false){
    if (result.data.length === 0){
      return res.status(200).json({status: false, token: ""})
    }
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 10);
    var token = jwt.sign({
      id: result.data[0].user_id,
      username: result.data[0].username,
      type: result.data[0].user_type,
      exp: parseInt(exp.getTime() / 1000),
    }, "egat-secret");
    return res.status(200).json({status: true, token: token})
  } else {
    return res.status(500).json(result.data)
  }
})

module.exports = router;