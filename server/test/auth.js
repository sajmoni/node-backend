const http = require('http');
const request = require('supertest');

const authMiddleware = require('../src/auth');

describe("the auth middleware", () => {
  let app;
  before(() => {
    app = createServer();
  });

  context("with correct credentials", () => {
    it("should attach the user id to the request object", () => {
      return request(app)
        .get('/')
        .auth('simon', 'secret')
        .expect(200, "myUserId");
    })
  });

  context("with incorrect credentials", () => {
    it("should return 401", () => {
      return request(app)
        .get('/')
        .auth('simon', 'notsecret')
        .expect(401);
    });
  });
});

function createServer () {
  const middleware = authMiddleware({
    authenticate(user, pass) {
      return new Promise((resolve, reject) => {
        if (user === 'simon' && pass === 'secret') {
          resolve('myUserId');
        } else {
          resolve(null);
        }
      });
    }
  });

  return http.createServer((req, res) => {
    middleware(req, res, () => {
      res.end(req.userId);
    });
  });
}