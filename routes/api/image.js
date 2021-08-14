var router = require('express').Router();
var passport = require('passport');
var auth = require("./../auth")

router.get('/pimage', auth.query, async function(req, res, next) {
  if (!req.query.idcard){
    return res.status(400).json({errors: {message: "idcard can't be blank"}});
  }
  if (req.query.idcard === undefined || req.query.idcard === "undefined"){
    return res.status(400).json({errors: {message: "idcard can't be undefined"}});
  }
  return  res.status(200).sendFile(`${(process.env.PRODUCTIONAPI === 'false' ? 'C:\\xampp\\htdocs\\pimage\\': "/var/www/html/pimage/")}${req.query.idcard}.jpg`);
})
module.exports = router;