const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const { createUserRegistry, encrypt } = require('../src/user-registry');
const { getDatabaseViews } = require('../src/utils');

const COUCH_PORT = 5985;

const mock = require('mock-couch');
const nano = require('nano-blue');

let mockCouch;

describe("Authenticating a user", () => {
  let reg, conn;

  before(() => {
    mockCouch = mock.createServer();
    mockCouch.listen(COUCH_PORT);
    conn = nano(`http://localhost:${COUCH_PORT}`);
    const db = conn.use('default');

    reg = createUserRegistry(db);

    mockCouch.addDB('default', [
      { _id: 'foo', email: "foo@foo.com", type: 'user', password: encrypt("secret")},
      { _id: 'bar', email: "bar@foo.com", type: 'user', password: encrypt("secret2")}
    ]);

    mockCouch.addDoc('default', getDatabaseViews());
  });

  after((done) => {
    // Wait a moment before we shut down the server so tests can finish
    setTimeout(() => {
      mockCouch.close();
      done();
    }, 100);
  });

  it("returns the user ID if the username and password are correct", () => {
    return expect(reg.authenticate('foo@foo.com', 'secret')).to.eventually.equal('foo');
  });

  it("returns null if the password is incorrect", () => {
    return expect(reg.authenticate('foo@foo.com', 'notsecret')).to.eventually.be.null;
  });

  it("returns null if the user is not in the database", () => {
    return expect(reg.authenticate('notindb', 'secret')).to.eventually.be.null;
  });
});
