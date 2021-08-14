var jwt = require('express-jwt');
var secret = "egat-secret";

function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

function getTokenFromParam(req){
  if (req.query.token !== undefined) {
    return req.query.token
  }

  return null
}

var auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  }),
  query: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromParam
  })
};

module.exports = auth;
