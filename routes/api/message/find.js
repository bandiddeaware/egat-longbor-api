var router = require('express').Router();
var auth = require("./../../auth")

var find_message = require("./../../../mysql/message/find")

router.post('/', auth.required, async function(req, res, next) {
  var result = await find_message()
  if (result.isError === false){
    return res.status(200).json({ data: result.data, length: result.data.length, status: true })
  }
})
module.exports = router;