var router = require('express').Router();
var auth = require("./../../auth")

var add_message = require("./../../../mysql/message/new_delete")

router.delete('/', auth.required, async function(req, res, next) {
  const result = await add_message(req.body)
  if (result.isError === false){
    return res.status(200).json({ result: {data: result.data, mqtt: result.mqtt}, status: true })
  } else {
    return res.status(400).json({ result: {data: result.data, mqtt: result.mqtt}, status: false })
  }
})
module.exports = router;