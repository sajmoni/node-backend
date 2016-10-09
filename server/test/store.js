const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const { createStore } = require('../src/store');
const { getDatabaseViews } = require('../src/utils');

const COUCH_PORT = 5985;

const mock = require('mock-couch');
const nano = require('nano-blue');

let mockCouch, conn;

describe("the store", () => {
  let store;

  before(() => {
    mockCouch = mock.createServer();
    mockCouch.listen(COUCH_PORT);
    conn = nano(`http://localhost:${COUCH_PORT}`);
    const db = conn.use('default');

    store = createStore(db);

    mockCouch.addDB('default', [
      { _id: 'foo', email: "foo@foo.com", name:'Foo', password: 'XXXXXX', type: 'user' },
      { _id: 'mock', email: "mock@foo.com", name: 'Mock', password: 'XXXXXX', type: 'user' },
    ]);

    mockCouch.addDoc('default', getDatabaseViews());
  });

  after((done) => {
    setTimeout(() => {
      mockCouch.close();
      done();
    }, 100);
  });

  describe("getUser", () => {
    it("returns the username for user foo", () => {
      return expect(store.getUser('foo')).to.eventually.satisfy(user => user.name === 'Foo');
    });
  });
});
