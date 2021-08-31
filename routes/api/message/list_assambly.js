var router = require('express').Router();
var auth = require("./../../auth")

router.patch('/list_assambly', auth.query, async function(req, res, next) {
  if (!req.query.idcard){
    return res.status(400).json({errors: {message: "idcard can't be blank"}});
  }
})
module.exports = router;