var router = require('express').Router();

router.get('/EGAT_Longbor_API.main.json', async function(req, res, next) {
  return  res.status(200).sendFile(`${(process.env.PRODUCTIONAPI === 'false' ? "C:\\Workshop\\EGAT-Longbor-WebAPI\\postman\\EGAT_Longbor_API.main.json": "/root/EGAT-Longbor-WebAPI/postman/EGAT_Longbor_API.main.json")}`);
})
module.exports = router;