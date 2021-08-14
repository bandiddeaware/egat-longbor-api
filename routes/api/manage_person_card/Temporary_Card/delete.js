var router = require('express').Router();
var auth = require("../../../auth")

var PersonDelete = require("../../../../mysql/TemporaryCard/Delete")

router.delete('/', auth.required, async function(req, res, next) {
  if (!req.body.id_person){
    return res.status(400).json({errors: {message: "id_person can't be blank"}});
  }
  if (isNaN(req.body.id_person)){
    return res.status(400).json({errors: {message: "id_person can't be number"}});
  }
  const result = await PersonDelete.Delete(req.body.id_person)
  if (result.isError === false){
    return res.status(200).json({ result: result.data, status: true })
  }

  return res.status(500).json( {result: result.data, status: false} )
})

module.exports = router;