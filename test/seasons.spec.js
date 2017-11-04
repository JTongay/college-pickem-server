process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const app = require('../server');
const supertest = require('supertest');

const request = supertest.agent(app);
const knex = require('../db/conf');
const moment = require('moment');

before((done) => {
  knex('seasons').insert({
    league: 'NCAA',
    start_date: moment.year('2017').month('09').date('05'),
    end_date: moment.year('2018').month('01').date('10'),
    active_season: true
  }).then(() => {
    done();
  });
});

after((done) => {
  console.log('truncating seasons');
  knex.raw('truncate table seasons RESTART IDENTITY;').then(() => {
    done();
  });
});

describe.only('Seasons', () => {
  describe('/ GET', () => {
    it('Returns a list of seasons', (done) => {
      request.get('/api/season/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
