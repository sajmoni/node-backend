const crypto = require('crypto');

const SALT = process.env.SALT;

function createUserRegistry(db) {
  return {
    authenticate(username, password) {
      return db.view('views', 'authenticate', {key: username}).spread((res) => {
        if (res.rows.length > 0 && res.rows[0].value === encrypt(password)) {
          return res.rows[0].id;
        } else {
          return null;
        }
      });
    }
  };
}

function encrypt(text) {
  return crypto.pbkdf2Sync(text, SALT, 10000, 512, 'sha512').toString('hex');
}

module.exports = {createUserRegistry, encrypt};
