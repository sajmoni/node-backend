const auth = require('basic-auth');

function authMiddleware(userRegistry) {
  return (req, res, next) => {
    const credentials = auth(req);

    let accessStatus;
    if (credentials) {
      accessStatus = userRegistry.authenticate(credentials.name, credentials.pass);
    } else {
      accessStatus = Promise.resolve(null);
    }

    accessStatus.then(user => {
      if (user) {
        req.userId = user;
        next();
      } else {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="node-default"');
        res.end('Access denied');
      }
    });
  }
}

module.exports = authMiddleware;