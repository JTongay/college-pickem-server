process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const app = require('../server');
const supertest = require('supertest');

const request = supertest.agent(app);
const knex = require('../db/conf');
const bcrypt = require('bcrypt');

const hashedPassword = bcrypt.hashSync('password', 12);

before((done) => {
  const joey = {
    username: 'jtongay',
    first_name: 'joey',
    last_name: 'tongay',
    password: hashedPassword,
    email: 'jtongay@netspend.com'
  };
  knex('users').insert(joey).then(() => {
    done();
  });
});
after((done) => {
  console.log('truncating users');
  knex.raw('truncate table users RESTART IDENTITY;').then(() => {
    done();
  });
});
describe('Booyah test', () => {
  it('should return me', (done) => {
    request.get('/api/users/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('username');
        expect(res.status).to.equal(200);
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
          expect(res.body.status).to.equal(200);
          expect(res.body.message).to.equal('success');
          expect(res.body).to.have.property('token');
          return done();
        });
    });
    it('should not create a new user if the username already exists', (done) => {
      const sampleRequest = {
        userName: 'jtongay',
        firstName: 'joey',
        lastName: 'tongay',
        password: 'password',
        email: 'someEmail@netspend.com'
      };
      request.post('/api/users/new')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('username or email already exists');
          expect(res.body.token).to.equal(null);
          return done();
        });
    });
    it('should not create a new user if the email already exists', (done) => {
      const sampleRequest = {
        userName: 'someUsername',
        firstName: 'joey',
        lastName: 'tongay',
        password: 'password',
        email: 'jtongay@netspend.com'
      };
      request.post('/api/users/new')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('username or email already exists');
          expect(res.body.token).to.equal(null);
          return done();
        });
    });
    it('returns a server error with a null password', (done) => {
      const sampleRequest = {
        userName: 'someUsername',
        firstName: 'joey',
        lastName: 'tongay',
        password: null,
        email: 'someEmail@netspend.com'
      };
      request.post('/api/users/new')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('missing required field');
          expect(res.body.response).to.equal('error');
          return done(err);
        });
    });
    it('returns a server error with a null first name', (done) => {
      const sampleRequest = {
        userName: 'someUsername',
        firstName: null,
        lastName: 'tongay',
        password: 'password',
        email: 'someEmail@netspend.com'
      };
      request.post('/api/users/new')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('missing required field');
          expect(res.body.response).to.equal('error');
          return done(err);
        });
    });
    it('returns a server error with a null last name', (done) => {
      const sampleRequest = {
        userName: 'someUsername',
        firstName: 'joey',
        lastName: null,
        password: 'password',
        email: 'someEmail@netspend.com'
      };
      request.post('/api/users/new')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('missing required field');
          expect(res.body.response).to.equal('error');
          return done(err);
        });
    });
    it('returns a server error with a null first and last name', (done) => {
      const sampleRequest = {
        userName: 'someUsername',
        firstName: null,
        lastName: null,
        password: 'password',
        email: 'someEmail@netspend.com'
      };
      request.post('/api/users/new')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('missing required field');
          expect(res.body.response).to.equal('error');
          return done(err);
        });
    });
  });
});
