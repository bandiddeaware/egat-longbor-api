var router = require('express').Router();

router.use("/dashboard", require("./summary"))
router.use("/dashboard", require("./list_car"))
router.use("/dashboard", require("./list_person"))
router.use("/dashboard", require("./list_point"))
router.use("/dashboard", require("./list_person_in_bor"))
router.use("/dashboard", require("./summary_assambly_point"))

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

// access_result
//   ACCESS_GRANTED = 0;
//   PERMISSION_DENIED = -1;
//   CARD_EXPIRED = -2;
//   NO_CARD_EXISTED = -3;
//   INVALID_CHANNEL_TYPE = -4;
//   CARD_NOT_ACTIVATED = -5;

// access_type
//   TYPE_UNKNOWN = 0;
//   TYPE_PERSON = 1;
//   TYPE_VEHICLE = 2;

// access_direction
//   IN = 0;
//   OUT = 1;

// entrance_id
//   id ด่าน

// ch_id
//   ช่องทางเข้า

// ch_type
//   CH_PERSON = 0;
// 	CH_VEHICLE = 1;
