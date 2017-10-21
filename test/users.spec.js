process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const app = require('../server');
const supertest = require('supertest');

const request = supertest.agent(app);
const knex = require('../db/conf');

describe('Users', () => {
  // afterEach((done) => {
  //   knex('users').truncate();
  //   console.log('truncating users');
  //   done();
  // });
  describe('POST /new', () => {
    it('should create a new user', (done) => {
      const sampleRequest = {
        userName: 'testUser',
        password: 'password',
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com'
      };
      request.post('/api/users/new')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          console.log(res.body);
          expect(res.body).to.exist;
          return done();
        });
    });
  });
});
