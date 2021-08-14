var router = require('express').Router();
var passport = require('passport');
var auth = require("../../../auth")

var gencardTemporary = require("../../../../mysql/TemporaryCard/GenCardId")

router.post('/export', auth.required, async function(req, res, next) {
  if (!req.body.card_value){
    return res.status(400).json({errors: {message: "card_value can't be blank"}});
  }

  var result = await gencardTemporary(req.body.card_value)
  if (result.isError === false){
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=export.zip`);
    res.set('Content-Length',result.data.length);
    return res.status(200).send(result.data);
  }
  return res.status(500).json({ 
    data: result.data,  
    status: false, 
  })
})

module.exports = router;