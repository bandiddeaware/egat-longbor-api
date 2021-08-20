var router = require('express').Router();
var auth = require("../../../auth")

var ExportCSV = require("../../../../mysql/personExport")

router.post('/export', auth.required, async function(req, res, next) {
  var request_id_person = `[${req.body.id_person}]`
  console.log(`[debug] Export Person -> ${request_id_person}`)
  if (!req.body.id_person){
    return res.status(400).json({errors: {message: "id_person can't be blank"}});
  }
  var mysql_search_id = request_id_person.replace("[", "(").replace("]",")")
  try {
    if (JSON.parse(request_id_person).length === 0){
      return res.status(400).json({errors: {message: "id_person can't be array"}});
    }
  }catch (e){
    return res.status(400).json({errors: {message: "id_person invalid format"}});
  }
  const result = await ExportCSV(mysql_search_id, JSON.parse(request_id_person))
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





// var router = require('express').Router();
// var passport = require('passport');
// var export_person = require("../../../../data/person_card/export_person")
// var auth = require("../../../auth")

// var PersonFindByID = require("../../../../mysql/PersonCard/FindByID")

// router.post('/export', auth.required, async function(req, res, next) {
//   if (!req.body.id_person){
//     return res.status(400).json({errors: {message: "id_person can't be blank"}});
//   }
//   var mysql_search_id = req.body.id_person.replaceAll("[", "(").replaceAll("]",")")
//   const result = await PersonFindByID.FindMultipleID(mysql_search_id)
//   if (result.isError === false){
//     return res.status(200).json({ 
//       data: result.data,  
//       status: true, 
//       header: "employee_id, employee_idcard, employee_name_title, employee_name, employee_lastname, employee_picture, card_id, company_id, company_name"
//     })
//   }
//   return res.status(500).json({ 
//     data: result.data,  
//     status: false, 
//   })
// })

// module.exports = router;