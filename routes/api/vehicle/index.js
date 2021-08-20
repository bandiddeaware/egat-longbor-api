var router = require('express').Router();

router.use("/vehicle", require("./find"))
router.use("/vehicle", require("./add"))
router.use("/vehicle", require("./edit"))
router.use("/vehicle", require("./export"))

router.use("/vehicle", require("./list_brand"))
router.use("/vehicle", require("./list_vehicle_type"))
router.use("/vehicle", require("./list_vehicle_classification"))

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