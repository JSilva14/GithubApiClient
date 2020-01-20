/**
 *  Used to validate incoming requests
 */

const { header, validationResult } = require('express-validator');

const acceptHeaderKey = 'Accept';
const applicationJson = 'application/json';
const acceptHeaderError = 'Accept header should be application/json';
const unexpectedError = 'An unexpected error has occurred';

/**
 * Applies validation rules to the request
 * 
 * @returns An array of errors obtained
 */
function requestValidationRules() {
  return [
    header(acceptHeaderKey, acceptHeaderError).equals(applicationJson)
  ]
}

/**
 * Builds an error response based on the first error in the array returned by requestValidationRules().
 * If the error array is empty, calls next().
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validate(req, res, next) {

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

module.exports.requestValidationRules = requestValidationRules;
module.exports.validate = validate;