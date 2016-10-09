const utils = require('./utils');

const cloudantUrl = utils.getDbUrl(process.env);
const conn = require('nano-blue')(cloudantUrl);
const dbName = process.env.DB_NAME || 'default';
const db = conn.use(dbName);

const { createStore } = require('./store');
const { createUserRegistry } = require('./user-registry');

const app = require('./api')(createUserRegistry(db), createStore(db));

const port = process.env.PORT || 3000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`);
});