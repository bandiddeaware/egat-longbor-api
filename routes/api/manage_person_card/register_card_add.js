var router = require('express').Router();
var auth = require("../../auth")

var registercard = require("../../../mysql/RegisterCard/Add")

router.post('/registor_card', auth.required, async function(req, res, next) {
  console.log(req.body)
  if (!req.body.card_id){
    return res.status(400).json({errors: {message: "card_id can't be blank"}});
  }
  if (!req.body.uhf_code){
    return res.status(400).json({errors: {message: "uhf_code can't be blank"}});
  }
  if (!req.body.mifare_code){
    return res.status(400).json({errors: {message: "mifare_code can't be blank"}});
  }
  const result = await registercard.Add(req.body.card_id, req.body.uhf_code, req.body.mifare_code,)
  if (result.isError === false){
    return res.status(200).json({ result: result.data, status: true })
  } else {
    return res.status(500).json( {result: result.data, status: false} )
  }
})

module.exports = router;