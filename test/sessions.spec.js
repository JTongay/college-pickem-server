process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const app = require('../server');
const supertest = require('supertest');

const request = supertest.agent(app);
// const knex = require('../db/conf');
// const bcrypt = require('bcrypt');

describe('Session', () => {
  describe('POST /login', () => {
    it('should log a user in', (done) => {
      const sampleRequest = {
        username: 'jtongay',
        password: 'password'
      };
      request.post('/api/session/login')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.status).to.equal(200);
          return done();
        });
    });
  });
});
