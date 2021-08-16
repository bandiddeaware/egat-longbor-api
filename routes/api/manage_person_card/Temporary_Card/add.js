var router = require('express').Router();
var fs = require('fs')

var auth = require("../../../auth")
var PersonAdd = require("../../../../mysql/TemporaryCard/Add")

var parseDateTime = require('../../../../commons/parseDateTime')
var WriteImage = require('../../../../commons/saveFileIsPerson')

const sharp = require('sharp');

const undefinedToNull = (value) => {
  return (value === undefined ? null: value)
}

router.put('/', auth.required, async function(req, res, next) {
  if (!req.body.idcard){
    return res.status(400).json({errors: {message: "idcard can't be blank"}});
  }
  if (!req.body.name_title){
    return res.status(400).json({errors: {message: "name_title can't be blank"}});
  }
  if (!req.body.firstname){
    return res.status(400).json({errors: {message: "firstname can't be blank"}});
  }
  if (!req.body.lastname){
    return res.status(400).json({errors: {message: "lastname can't be blank"}});
  }
  if (!req.body.mine_permit){
    return res.status(400).json({errors: {message: "mine_permit can't be blank"}});
  }
  if (!req.body.company_id){
    return res.status(400).json({errors: {message: "company_id can't be blank"}});
  }
  if (!req.body.mine_permit){
    return res.status(400).json({errors: {message: "mine_permit can't be blank"}});
  }


  if (req.body.idcard === undefined || req.body.idcard === "undefined"){
    return res.status(400).json({errors: {message: "idcard can't be undefined"}});
  }
  if (req.body.name_title === undefined || req.body.name_title === "undefined"){
    return res.status(400).json({errors: {message: "name_title can't be undefined"}});
  }
  if (req.body.firstname === undefined || req.body.firstname === "undefined"){
    return res.status(400).json({errors: {message: "firstname can't be undefined"}});
  }
  if (req.body.lastname === undefined || req.body.lastname === "undefined"){
    return res.status(400).json({errors: {message: "lastname can't be undefined"}});
  }
  if (req.body.mine_permit === undefined || req.body.mine_permit === "undefined"){
    return res.status(400).json({errors: {message: "mine_permit can't be undefined"}});
  }
  if (req.body.company_id === undefined || req.body.company_id === "undefined"){
    return res.status(400).json({errors: {message: "company_id can't be undefined"}});
  }
  if (req.body.mine_permit === undefined || req.body.mine_permit === "undefined"){
    return res.status(400).json({errors: {message: "mine_permit can't be undefined"}});
  }

  // validation contract
  if (req.body.contract_number === undefined || req.body.contract_number === "undefined" || req.body.contract_number === "null" || req.body.contract_number === "NULL"){
    // return res.status(400).json({errors: {message: "contract_number can't be undefined, null and NULL"}});
  }else {
    if (req.body.contract_start === undefined || req.body.contract_start === "undefined" || req.body.contract_start === "null" || req.body.contract_start === "NULL"){
      return res.status(400).json({errors: {message: "contract_start can't be undefined, null and NULL"}});
    }
    if (req.body.contract_end === undefined || req.body.contract_end === "undefined" || req.body.contract_end === "null" || req.body.contract_end === "NULL"){
      return res.status(400).json({errors: {message: "contract_end can't be undefined, null and NULL"}});
    }
  }

  // if (!req.body.card_id){
  //   return res.status(400).json({errors: {message: "card_id can't be blank"}});
  // }
  // if (!req.body.idcard_expired){
  //   return res.status(400).json({errors: {message: "idcard_expired can't be blank"}});
  // }
  if (!req.body.is_accept_work){
    return res.status(400).json({errors: {message: "is_accept_work can't be blank"}});
  }
  const result_query = await PersonAdd.Add(
    req.body.idcard, 
    req.body.name_title, 
    req.body.firstname, 
    req.body.lastname, 
    req.body.birthday, 
    req.body.sex, 
    req.body.religion, 
    req.body.house_no, 
    req.body.village_no, 
    req.body.alley, 
    req.body.lane, 
    req.body.road, 
    req.body.sub_district, 
    req.body.district, 
    req.body.provinces, 
    req.body.idcard_expired, 
    `${req.body.idcard}.jpg`, // picture 
    req.body.company_id,     
    parseDateTime(new Date()), 
    parseDateTime(new Date()), 
    (req.body.mine_permit === "true" ? 1: 0), 
    req.body.card_id, 
    req.body.card_expired, 
    (req.body.is_accept_work === "true" ? 6: 5),
    req.body.contract_number,
    req.body.contract_start,
    req.body.contract_end,
  )
  if (result_query.isError === false){
    if (req.file !== undefined){

      var idcard = req.body.idcard
      var resize_image_buffer = await sharp(req.file.buffer).resize(150, 150).jpeg({ quality: 100 }).toBuffer()
      const result_save_image = await WriteImage(resize_image_buffer, idcard)
      if (result_save_image.result){
        return res.status(200).json({ result: result_query.data, status: true })
      } else {
        return res.status(500).json({ result: {
          errors: result_save_image.errors
        }, status: false })
      }
    } else {
      return res.status(200).json({ result: result_query.data, status: true })
    }
  } else {
    return res.status(500).json( {result: result_query.data, status: false} )
  }
})

module.exports = router;