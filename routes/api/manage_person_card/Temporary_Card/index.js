var router = require('express').Router();

router.use("/temporary_card", require("./find"))
router.use("/temporary_card", require("./add"))
router.use("/temporary_card", require("./delete"))
router.use("/temporary_card", require("./edit"))
router.use("/temporary_card", require("./export"))
router.use("/temporary_card", require("./link_card"))
router.use("/temporary_card", require("./return_card"))

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