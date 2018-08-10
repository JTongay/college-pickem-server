process.env.NODE_ENV = 'test';

import * as supertest from 'supertest';
import { expect } from 'chai';
import { app, server } from '@/index';

describe('Season Routes', () => {

  describe('Get /:id', () => {
    afterEach(() => {
      server.close();
    });
    it('should get a single season', (done) => {
      supertest(app)
        .get('/api/season/1')
        .expect(200)
        .end((err: any, res: supertest.Response) => {
          if (err) {
            done();
          }
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object');
        });
      done();
    });
  });

});
