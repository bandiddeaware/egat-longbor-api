var router = require('express').Router();

router.use("/managepersoncard", require("./Person_Card"))
router.use("/managepersoncard", require("./Temporary_Card"))
router.use("/managepersoncard", require("./register_card_add"))
router.use("/managepersoncard", require("./register_card_edit"))
router.use("/managepersoncard", require("./register_card_delete"))

router.use("/managepersoncard", require("./list_cardstatus"))
router.use("/managepersoncard", require("./list_company"))
router.use("/managepersoncard", require("./list_contract"))
router.use("/managepersoncard", require("./list_provice"))
router.use("/managepersoncard", require("./list_type"))

router.use("/", require("./link_card"))

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(444).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;