const request = require('supertest');
const { expect } = require('chai');

const mockRegistry = {
  authenticate: (user, pass) => new Promise((resolve, reject) => {
    if (user === 'foo@foo.com' && pass === 'secret') {
      resolve('foo');
    }
    if (user === 'bar@foo.com' && pass === 'secret') {
      resolve('bar');
    }
    resolve(null);
  })
};

const authorizedUser = {
  user: 'foo@foo.com',
  password: 'secret'
};
const unAuthorizedUser = {
  user: 'foo@foo.com',
  password: 'notsecret'
};
const getUserResponse = {
  foo: 'bar'
}

const mockStore = {
  getUser: (id) => new Promise((resolve, reject) => {
    if (id === 'foo'){
      resolve(getUserResponse);
    }
  })
};

const app = require('../src/api')(mockRegistry, mockStore);

describe("Loading the homepage", () => {
  context("without any credentials", () => {
    it("challenges for basic auth", () => {
      return request(app)
        .get('/')
        .expect(401);
    });
  });

  context("with the correct credentials", () => {
    it("should return the home page", () => {
      return request(app)
        .get('/')
        .auth(authorizedUser.user, authorizedUser.password)
        .expect(200);
    });
  });

  context("with incorrect credentials", () => {
    it("challenges again for basic auth", () => {
      return request(app)
        .get('/')
        .auth(unAuthorizedUser.user, unAuthorizedUser.pass)
        .expect(401);
    });
  });
});

describe("GET /api/user", () => {
  it("responds with the user", () => {
    return request(app)
      .get('/api/user')
      .auth(authorizedUser.user, authorizedUser.password)
      .set('Accept', 'application/json')
      .expect(200)
  });
});