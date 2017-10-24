process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const app = require('../server');
const supertest = require('supertest');

const request = supertest.agent(app);
// const knex = require('../db/conf');
// const bcrypt = require('bcrypt');

describe.only('Session', () => {
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
            done(err);
          }
          expect(res.body.status).to.equal(200);
          expect(res.body.message).to.equal('success');
          expect(res.body.token).to.not.equal(null);
          done();
        });
    });
    it('should not log a user in with incorrect username', (done) => {
      const sampleRequest = {
        username: 'jtongay1',
        password: 'password'
      };
      request.post('/api/session/login')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('incorrect username/password');
          expect(res.body.token).to.equal(null);
          done();
        });
    });
    it('should not log a user in with incorrect password', (done) => {
      const sampleRequest = {
        username: 'jtongay',
        password: 'password1'
      };
      request.post('/api/session/login')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('incorrect username/password');
          expect(res.body.token).to.equal(null);
          done();
        });
    });
    it('should not log a user in with no username', (done) => {
      const sampleRequest = {
        username: null,
        password: 'password1'
      };
      request.post('/api/session/login')
        .send(sampleRequest)
        .expect(400)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.status).to.equal(400);
          expect(res.body.message).to.equal('you must enter a username and password');
          expect(res.body.token).to.equal(null);
          done();
        });
    });
    it('should not log a user in with no password', (done) => {
      const sampleRequest = {
        username: 'jtongay',
        password: null
      };
      request.post('/api/session/login')
        .send(sampleRequest)
        .expect(400)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.body.status).to.equal(400);
          expect(res.body.message).to.equal('you must enter a username and password');
          expect(res.body.token).to.equal(null);
          done();
        });
    });
  });
});
