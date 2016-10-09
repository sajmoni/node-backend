
function createStore(db) {
  return {
    getUser(id) {
      return db.view('views', 'user', { key: id }).spread((res) => {
        return res.rows[0].value;
      });
    }
  }
}

module.exports = { createStore };