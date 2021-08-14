var router = require('express').Router();
var fs = require('fs')

var auth = require("../../auth")
var VehicleAdd = require("../../../mysql/Vehicle/Add")
var WriteImage = require('../../../commons/saveFileIsVehicle')

const sharp = require('sharp');

router.put('/', auth.required, async function(req, res, next) {

  if (!req.body.brand_id){
    return res.status(400).json({errors: {message: "brand_id can't be blank"}});
  }
  if (!req.body.province_id){
    return res.status(400).json({errors: {message: "province_id can't be blank"}});
  }
  if (!req.body.type_Id){
    return res.status(400).json({errors: {message: "type_Id can't be blank"}});
  }
  if (!req.body.company_id){
    return res.status(400).json({errors: {message: "company_id can't be blank"}});
  }


  if (req.body.brand_id === undefined || req.body.brand_id === "undefined"){
    return res.status(400).json({errors: {message: "brand_id can't be undefined"}});
  }
  if (req.body.province_id === undefined || req.body.province_id === "undefined"){
    return res.status(400).json({errors: {message: "province_id can't be undefined"}});
  }
  if (req.body.type_Id === undefined || req.body.type_Id === "undefined"){
    return res.status(400).json({errors: {message: "type_Id can't be undefined"}});
  }
  if (req.body.company_id === undefined || req.body.company_id === "undefined"){
    return res.status(400).json({errors: {message: "company_id can't be undefined"}});
  }

  const result_query = await VehicleAdd(
    req.body.company_id,
    req.body.card_expired,
    req.body.mine_permit,
    req.body.license,
    req.body.province_id,
    req.body.brand_id,
    req.body.type_Id,
    req.body.remark,
    req.body.model,
    req.body.egat_plate,
    req.body.faction2_DIV,
    req.body.faction2_D_ABBR
  )
  if (result_query.isError === false){
    if (req.file !== undefined){
      // save picture file
      var idVehicle = result_query.data.insertId
      var resize_image_buffer = await sharp(req.file.buffer).resize(150, 150).jpeg({ quality: 100 }).toBuffer()
      const result_save_image = await WriteImage(resize_image_buffer, idVehicle)
      if (result_save_image.result){
        return res.status(200).json({ result: result_query.data, status: true })
      } else {
        return res.status(500).json({ result: {
          errors: result_save_image.errors
        }, status: false })
      }

      // end save picture file
    }else {
      return res.status(200).json({ result: result_query.data, status: true })
    }
  } else {
    return res.status(500).json( {result: result_query.data, status: false} )
  }
})

module.exports = router;