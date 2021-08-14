var router = require('express').Router();
var auth = require("../../../auth")
var temporary = require("../../../../mysql/TemporaryCard/Find")

router.post('/', auth.required, async function(req, res, next) {
  // console.log(res)

  // if (!(req.payload.exp - req.payload.iat) > 0){
  //   return res.status(405).json({errors: {message: "Token is expired."}});
  // }
  // 400 - 499 handle client error.
  if (!req.body.offset){
    return res.status(400).json({errors: {message: "offset can't be blank"}});
  }
  if (!req.body.limit){
    return res.status(400).json({errors: {message: "limit can't be blank"}});
  }
  if (isNaN(req.body.offset)){
    return res.status(400).json({errors: {message: "offset can't be number"}});
  }
  if (isNaN(req.body.limit)){
    return res.status(400).json({errors: {message: "limit can't be number"}});
  }

  const result = await temporary.Find(
    req.body.id_card,
    req.body.name,
    req.body.surname,
    req.body.uhf_id,
    req.body.mifare_id,
    req.body.card_type,
    req.body.is_expired_card,
    req.body.is_accept_mine,
    req.body.offset,
    req.body.limit,
  )
  if (result.isError === false){
    return res.status(200).json({ data: result.data, length: result.count[0].length, status: true })
  } else {
    return res.status(500).json( {data: result.data, status: false} )
  }
})

module.exports = router;