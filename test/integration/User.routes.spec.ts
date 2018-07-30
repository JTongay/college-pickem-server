import * as supertest from 'supertest';
import { app, server } from '@/index';
import { expect } from 'chai';
// import 'mocha';

describe('User Routes', () => {
  afterEach(async function () {
    await server.close();
  });
  describe('Get /', () => {
    it('should get all users', (done) => {
      supertest(app)
        .get('/api/user/')
        .expect(200)
        .end((err: any, res: supertest.Response) => {
          if (err) {
            done();
          }
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

});
