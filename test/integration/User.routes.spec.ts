process.env.NODE_ENV = 'test';

import * as supertest from 'supertest';
import { app, server } from '@/index';
import { expect } from 'chai';
// import 'mocha';

describe('User Routes', () => {

  describe('Get /', () => {
    afterEach(async () => {
      await server.close();
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
          done();
        });
    });
  });

});
