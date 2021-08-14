var router = require('express').Router();
var registercard = require("../../../mysql/RegisterCard/Delete")
var auth = require("../../auth")

router.delete('/registor_card', auth.required, async function(req, res, next) {
  if (!req.body.card_id){
    return res.status(400).json({errors: {message: "card_id can't be blank"}});
  }
  const result = await registercard.Delete(req.body.card_id, req.body.uhf_code, req.body.mifare_code,)
  if (result.isError === false){
    return res.status(200).json({ result: result.data, status: true })
  } else {
    return res.status(500).json( {result: result.data, status: false} )
  }
})

module.exports = router;