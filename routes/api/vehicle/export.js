var router = require('express').Router();
var passport = require('passport');
var auth = require("../../auth")

var ExportCSV = require("../../../mysql/vehicleExport")

router.post('/export', auth.required, async function(req, res, next) {
  var request_id_vehicle = `[${req.body.id_vehicle}]`
  if (!request_id_vehicle){
    return res.status(400).json({errors: {message: "id_vehicle can't be blank"}});
  }
  var mysql_search_id = request_id_vehicle.replace("[", "(").replace("]",")")
  try {
    if (JSON.parse(request_id_vehicle).length === 0){
      return res.status(400).json({errors: {message: "id_vehicle can't be array"}});
    }
  }catch (e){
    return res.status(400).json({errors: {message: "id_vehicle invalid format"}});
  }
  const result = await ExportCSV(mysql_search_id, JSON.parse(request_id_vehicle))
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