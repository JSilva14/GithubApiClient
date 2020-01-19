/**
 *  Used to validate incoming requests
 */

const { header, validationResult } = require('express-validator');

const acceptHeaderKey = 'Accept';
const applicationJson = 'application/json';
const acceptHeaderError = 'Accept header should be application/json';
const unexpectedError = 'An unexpected error has occurred';


const requestValidationRules = () => {
  return [
    header(acceptHeaderKey, acceptHeaderError).equals(applicationJson)
  ]
}

const validate = (req, res, next) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  
  if (errors.errors[0].msg === acceptHeaderError) {
    return res.status(406).json({
      status: 406,
      message: acceptHeaderError
    });
  }
  else{

    console.log(unexpectedError);
    console.log(JSON.stringify(errors));
    return res.status(500).json({
      status: 500,
      message: unexpectedError
    })
  }

}

module.exports = {
  requestValidationRules,
  validate,
}