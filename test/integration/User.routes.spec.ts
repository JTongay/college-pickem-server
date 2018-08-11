process.env.NODE_ENV = 'test';

import * as supertest from 'supertest';
import { app, server } from '@/index';
import { expect } from 'chai';
import { Connection } from '@/db/connection';
import { UserRequest } from '@/models';
import * as knexConfig from '../../knexfile';

import 'mocha';

describe('User Routes', () => {

  describe('Get /', () => {
    afterEach(() => {
      server.close();
    });
    it('should get all users', (done) => {
      supertest(app)
        .get('/api/user/')
        .expect(200)
        .end((err: any, res: supertest.Response) => {
          if (err) {
            done();
          }
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0].username).to.equal('jtongay');
        });
      done();
    });
  });

  describe('GET /:id', () => {
    afterEach(() => {
      server.close();
    });
    it('should get a user with a valid id', (done) => {
      supertest(app)
        .get('/api/user/1')
        .expect(200)
        .expect('content-type', /application-json/)
        .end((err: any, res: supertest.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.username).to.equal('jtongay');
          expect(res.body.message).to.be.an('string');
        });
      done();
    });
    it('should not get a user with an invalid id', (done) => {
      supertest(app)
        .get('/api/user/1324')
        .expect(404)
        .end((err: any, res: supertest.Response) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          // expect(res.body.data.username).to.equal('jtongay');
          // expect(res.body.message).to.be.an('string');
        });
      done();
    });
  });

  describe('POST /', () => {
    // let knex;
    beforeEach(() => {
      // knex = new Connection();
    });
    afterEach(() => {
      server.close();
    });
    it('should create a new user', (done) => {
      const sampleRequest: UserRequest = new UserRequest(
        'testUser',
        'password',
        'test',
        'user',
        'test@user.com');
      supertest(app)
        .post('/api/user')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err: any, res: supertest.Response) => {
          if (err) {
            done();
          }
          expect(res.status).to.equal(200);
          done();
        });
      done();
    });
  });

});
