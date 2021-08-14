var router = require('express').Router();
var registercard = require("../../../mysql/RegisterCard/Edit")
var auth = require("../../auth")

router.link('/link_card', auth.required, async function(req, res, next) {
  if (!req.body.card_id){
    return res.status(400).json({errors: {message: "card_id can't be blank"}});
  }
  if (!req.body.uhf_id){
    return res.status(400).json({errors: {message: "uhf_id can't be blank"}});
  }
  if (!req.body.mifare_id){
    return res.status(400).json({errors: {message: "mifare_id can't be blank"}});
  }

  if (req.body.card_id === undefined || req.body.card_id === "undefined"){
    return res.status(400).json({errors: {message: "card_id can't be undefined"}});
  }
  if (req.body.uhf_id === undefined || req.body.uhf_id === "undefined"){
    return res.status(400).json({errors: {message: "uhf_id can't be undefined"}});
  }
  if (req.body.mifare_id === undefined || req.body.mifare_id === "undefined"){
    return res.status(400).json({errors: {message: "mifare_id can't be undefined"}});
  }

  if (req.body.type === "person"){
    const result = await registercard.Edit(req.body.card_id, req.body.uhf_id, req.body.mifare_id,)
    if (result.isError === false){
      return res.status(200).json({ result: result.data, status: true })
    } else {
      return res.status(500).json( {result: result.data, status: false} )
    } 
  } else {
    const result = await registercard.Edit(req.body.card_id, req.body.uhf_id, req.body.mifare_id,)
    if (result.isError === false){
      return res.status(200).json({ result: result.data, status: true })
    } else {
      return res.status(500).json( {result: result.data, status: false} )
    }
  }
})

module.exports = router;