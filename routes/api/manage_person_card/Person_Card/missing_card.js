var router = require('express').Router();
var passport = require('passport');
var auth = require("../../../auth")

var returncard = require("../../../../mysql/ReturnCard")

router.unlink('/card/missing', auth.required, async function(req, res, next) {
  if (!req.body.id_person){
    return res.status(400).json({errors: {message: "id_person can't be blank"}});
  }
  if (req.body.id_person === undefined || req.body.id_person === "undefined"){
    return res.status(400).json({errors: {message: "id_person can't be undefined"}});
  }
  const result_query = await returncard(req.body.id_person, 0)

  if (result_query.isError === false){
    return res.status(200).json({ result: result_query.data, status: true })
  }
  return res.status(500).json( {result: result_query.data, status: false} )
})

module.exports = router;