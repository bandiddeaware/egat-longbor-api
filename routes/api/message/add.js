var router = require('express').Router();
var auth = require("./../../auth")

var add_message = require("./../../../mysql/message/add")

router.put('/', auth.required, async function(req, res, next) {
  const result = await add_message(req.body)
  if (result.isError === false){
    return res.status(200).json({ result: result.data, status: true })
  } else {
    return res.status(400).json({ result: result.data, status: false })
  }
})
module.exports = router;