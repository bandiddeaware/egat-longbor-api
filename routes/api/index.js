var router = require('express').Router();

router.use('/', require('./auth'));
router.use("/", require("./manage_person_card"))
router.use("/", require("./magne_rfid_card"))
router.use("/", require("./dashboard"))
router.use("/", require("./device"))
router.use("/", require("./report"))
router.use("/", require("./list_card"))
router.use("/", require("./list_card_vehicle"))
router.use("/", require("./image"))
router.use("/", require("./postman"))
router.use("/", require("./vehicle"))
router.use("/", require("./list_faction"))
router.use("/", require("./list_contract"))
router.use("/", require("./message"))
// for test
// router.use("/", require("./test_zip"))

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(405).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }
  return next(err);
});

module.exports = router;