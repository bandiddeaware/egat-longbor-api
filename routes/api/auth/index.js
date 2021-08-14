var router = require('express').Router();

router.use('/auth', require('./login'));
router.use('/auth', require('./new_login'));

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