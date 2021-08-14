var router = require('express').Router();
var passport = require('passport');
// var data1_10 = require("../../../../data/person_card/find1-10")
// var data1_5 = require("../../../../data/person_card/find1-5")
// var data6_10 = require("../../../../data/person_card/find6-10")
var auth = require("../../../auth")

var PersonFind = require('./../../../../mysql/PersonCard/Find')

router.post('/', auth.required, async function(req, res, next) {
  // if (!(req.payload.exp - req.payload.iat) > 0){
  //   return res.status(401).json({errors: {message: "Token is expired."}});
  // }
  // 400 - 499 handle client error.
  if (!req.body.offset){
    return res.status(400).json({errors: {message: "offset can't be blank"}});
  }
  if (!req.body.limit){
    return res.status(400).json({errors: {message: "limit can't be blank"}});
  }
  if (isNaN(req.body.offset)){
    return res.status(400).json({errors: {message: "offset can't be number"}});
  }
  if (isNaN(req.body.limit)){
    return res.status(400).json({errors: {message: "limit can't be number"}});
  }
  const result = await PersonFind.Find(
    req.body.id_card,
    req.body.name,
    req.body.surname,
    req.body.uhf_id,
    req.body.mifare_id,
    req.body.company_name,
    req.body.is_card_number,
    req.body.is_expire_card,
    req.body.is_accept_mine,
    Number(req.body.offset),
    Number(req.body.limit),
  )
  if (result.isError === false){
    return res.status(200).json({ data: result.data, length: result.count[0].length, status: true })
  } else {
    return res.status(500).json( {data: result.data, status: false} )
  }
})

module.exports = router;