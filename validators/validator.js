/**
 *  Used to validate incoming requests
 */

const {header, validationResult} = require('express-validator');


const requestValidationRules = () => {
    return [
        header('Accept', 'Accept header should be application/json').equals('application/json')
    ]  
} 

const validate = (req, res, next) => {

    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
  
    return res.status(406).json({
      status: 406,
      message: errors.errors[0].msg
    });

  }

  module.exports = {
    requestValidationRules,
    validate,
  }