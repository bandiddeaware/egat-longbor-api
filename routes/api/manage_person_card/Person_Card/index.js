var router = require('express').Router();

router.use("/person_card", require("./find"))
router.use("/person_card", require("./add"))
router.use("/person_card", require("./delete"))
router.use("/person_card", require("./edit"))
router.use("/person_card", require("./export"))
router.use("/person_card", require("./link_card"))
router.use("/person_card", require("./missing_card"))
router.use("/person_card", require("./return_card"))

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