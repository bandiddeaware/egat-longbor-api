var router = require('express').Router();
var passport = require('passport');
var auth = require("../../../auth")

var returncard = require("../../../../mysql/ReturnCardTemporary")

router.unlink('/card/return', auth.required, async function(req, res, next) {
  if (!req.body.card_id){
    return res.status(400).json({errors: {message: "card_id can't be blank"}});
  }

  if (req.body.card_id === undefined || req.body.card_id === "undefined"){
    return res.status(400).json({errors: {message: "card_id can't be undefined"}});
  }
  
  if (!req.body.person_id){
    return res.status(400).json({errors: {message: "person_id can't be blank"}});
  }

  if (req.body.person_id === undefined || req.body.person_id === "undefined"){
    return res.status(400).json({errors: {message: "person_id can't be undefined"}});
  }

  const result_query = await returncard(req.body.card_id, 0, req.body.person_id)

  if (result_query.isError === false){
    return res.status(200).json({ result: result_query.data, status: true })
  }
  return res.status(500).json( {result: result_query.data, status: false} )
})

module.exports = router;