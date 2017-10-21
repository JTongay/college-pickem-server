process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const app = require('../server');
const supertest = require('supertest');

const request = supertest.agent(app);
const knex = require('../db/conf');

// beforeEach((done) => {
//   const joey = {
//     username: 'jtongay',
//     first_name: 'joey',
//     last_name: 'tongay',
//     password: 'password',
//     email: 'jtongay@netspend.com'
//   };
//   knex('users').insert(joey).then(() => {
//     done();
//   });
// });
afterEach((done) => {
  console.log('truncating users');
  knex.raw('TRUNCATE TABLE users RESTART IDENTITY');
  done();
});
describe('Booyah test', () => {
  it('should return me', (done) => {
    const joey = {
      username: 'jtongay',
      first_name: 'joey',
      last_name: 'tongay',
      password: 'password',
      email: 'jtongay@netspend.com'
    };
    knex('users').insert(joey).then(() => {});
    request.get('/api/users/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        console.log(res.body, 'body in test');
        expect(res.body).to.exist;
        expect(res.body).to.have.property('username');
        return done();
      });
  });
});


describe('Users', () => {
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
