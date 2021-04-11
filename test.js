const { JWS } = require('./dist/jwt');

const jwt = new JWS({
  typ: "JWT",
  alg: "HS384",
}, {
  iss: "everett",
  exp: Date.now()+1000,
  iat: Date.now(),
})

const jwt_str = jwt.sign('mysecretkesyr');

const new_jwt = new JWS().fromString(jwt_str);

const new_jwt_str = new_jwt.sign('i3fou2h4f8yh4fy4f57924gf037gf2o374');

console.log(
    jwt,
    jwt_str,
    jwt.verify('mysecretkesyr'),
)

console.log(
    new_jwt,
    new_jwt_str,
    new_jwt.verify('i3fou2h4f8yh4fy4f57924gf037gf2o374'),
)