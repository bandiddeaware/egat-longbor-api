var router = require('express').Router();
var fs = require('fs')

var auth = require("../../auth")
var VehicleUpdate = require("../../../mysql/Vehicle/Edit")
var WriteImage = require('../../../commons/saveFileIsVehicle')

const sharp = require('sharp');

router.patch('/', auth.required, async function(req, res, next) {
  if (!req.body.vehicle_id) {
    return res.status(400).json({errors: {message: "vehicle_id can't be blank"}});
  }
  if (!req.body.brand_id){
    return res.status(400).json({errors: {message: "brand_id can't be blank"}});
  }
  if (!req.body.province_id){
    return res.status(400).json({errors: {message: "province_id can't be blank"}});
  }
  if (!req.body.classification){
    return res.status(400).json({errors: {message: "classification can't be blank"}});
  }
  if (!req.body.company_id){
    return res.status(400).json({errors: {message: "company_id can't be blank"}});
  }
  if (!req.body.vehicle_type){
    return res.status(400).json({errors: {message: "vehicle_type can't be blank"}});
  }


  if (req.body.vehicle_id === undefined || req.body.vehicle_id === "undefined") {
    return res.status(400).json({errors: {message: "vehicle_id can't be undefined"}});
  }

  if (req.body.egat_plate === null || req.body.egat_plate === "null" || req.body.egat_plate === "NULL"){
    return res.status(400).json({errors: {message: "egat_plate is null"}});
  }
  if (req.body.faction2_DIV === null || req.body.faction2_DIV === "null" || req.body.faction2_DIV === "NULL"){
    return res.status(400).json({errors: {message: "faction2_DIV is null"}});
  }
  if (req.body.faction2_D_ABBR === null || req.body.faction2_D_ABBR === "null" || req.body.faction2_D_ABBR === "NULL"){
    return res.status(400).json({errors: {message: "faction2_D_ABBR is null"}});
  }
  if (req.body.vehicle_type === null || req.body.vehicle_type === "null" || req.body.vehicle_type === "NULL"){
    return res.status(400).json({errors: {message: "vehicle_type is null"}});
  }
  

  if (req.body.egat_plate === ""){
    return res.status(400).json({errors: {message: "egat_plate is empty"}});
  }
  if (req.body.faction2_DIV === ""){
    return res.status(400).json({errors: {message: "faction2_DIV is empty"}});
  }
  if (req.body.faction2_D_ABBR === ""){
    return res.status(400).json({errors: {message: "faction2_D_ABBR is empty"}});
  }
  if (req.body.vehicle_type === ""){
    return res.status(400).json({errors: {message: "vehicle_type is empty"}});
  }

  const result_query = await VehicleUpdate(
    req.body.company_id,
    req.body.card_expired,
    req.body.mine_permit,
    req.body.license,
    req.body.province_id,
    req.body.brand_id,
    req.body.classification,
    req.body.remark,
    req.body.model,
    req.body.egat_plate,
    req.body.faction2_DIV,
    req.body.faction2_D_ABBR,
    req.body.vehicle_id,
    req.body.vehicle_type
  )


  if (result_query.isError === false){
    if (req.file !== undefined){
      // save picture file
      var idVehicle = req.body.vehicle_id
      var resize_image_buffer = await sharp(req.file.buffer).resize({ height: 150 }).jpeg({ quality: 70 }).toBuffer()
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