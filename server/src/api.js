const express = require('express');
const enforce = require('express-sslify');
const bodyParser = require('body-parser');
const authMiddleware = require('./auth');

function api(userRegistry, store) {
  const app = express();

  if (process.env.NODE_ENV === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  app.use(bodyParser.json());
  app.use(authMiddleware(userRegistry));

  app.get('/', (req, res) => {
    res.send('Node Backend');
  });

  app.get('/api/user', (req, res) => {
    store.getUser(req.userId).then(user => {
      res.json(user);
    });
  });
  
  // app.use(express.static(__dirname + '/../../public'));

  return app;
}

module.exports = api;
