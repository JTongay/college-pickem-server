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
    start_date: moment().year('2017').month('09').date('05'),
    end_date: moment().year('2018').month('01').date('10'),
    active_season: true
  }).then(() => {
    done();
  });
});

after((done) => {
  console.log('truncating seasons');
  knex.raw('truncate table seasons RESTART IDENTITY CASCADE;').then(() => {
    done();
  });
});

describe('Seasons', () => {
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
          expect(res.body.response).to.be.an('array');
          expect(res.body.response[0]).to.have.property('start_date');
          expect(res.body.response[0]).to.have.property('end_date');
          done();
        });
    });
  });
  describe('/:id GET', () => {
    it('Returns a season', (done) => {
      request.get('/api/season/1')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.response).to.be.an('object');
          expect(res.body.response).to.have.property('start_date');
          expect(res.body.response).to.have.property('end_date');
          done();
        });
    });
    it('fails to return a season if it doesn\'t exist', (done) => {
      request.get('/api/season/12')
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(404);
          expect(res.body.response).to.be.an('string');
          expect(res.body.response).to.equal('no season found with id 12');
          done();
        });
    });
  });
  describe('/create POST', () => {
    it('creates a new NCAA season and is active by default', (done) => {
      const sampleRequest = {
        league: 'NCAA',
        startDate: moment().year('2017').month('10').date('12'),
        endDate: moment().year('2018').month('02').date('13')
      };
      request.post('/api/season/create')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.response).to.have.property('league');
          expect(res.body.response.league).to.equal('NCAA');
          expect(res.body.response).to.have.property('start_date');
          expect(res.body.response).to.have.property('end_date');
          expect(res.body.response).to.have.property('active_season');
          expect(res.body.response.active_season).to.equal(true);
          done();
        });
    });
    it('creates a new NFL season and is active by default', (done) => {
      const sampleRequest2 = {
        league: 'NFL',
        startDate: moment().year('2017').month('11').date('12'),
        endDate: moment().year('2018').month('01').date('13')
      };
      request.post('/api/season/create')
        .send(sampleRequest2)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.response).to.have.property('league');
          expect(res.body.response.league).to.equal('NFL');
          expect(res.body.response).to.have.property('start_date');
          expect(res.body.response).to.have.property('end_date');
          expect(res.body.response).to.have.property('active_season');
          expect(res.body.response.active_season).to.equal(true);
          done();
        });
    });
    it('sends an error when no league is sent', (done) => {
      const sampleRequest = {
        startDate: moment().year('2017').month('10').date('12'),
        endDate: moment().year('2018').month('02').date('13')
      };
      request.post('/api/season/create')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(404);
          expect(res.body.response).to.equal('you must send NFL or NCAA');
          expect(res.body.status).to.equal(404);
          done();
        });
    });
  });
  describe('/:id PUT', () => {
    it('should edit an existing season', (done) => {
      const sampleRequest = {
        league: 'NFL',
        startDate: moment().year('2017').month('11').date('12'),
        endDate: moment().year('2018').month('01').date('13'),
        activated: false
      };
      request.put('/api/season/1')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.response.league).to.equal('NFL');
          expect(res.body.response.start_date).to.be.an('string');
          expect(res.body.response.active_season).to.equal(false);
          done();
        });
    });
    it('should edit an existing season with sending only one property', (done) => {
      const sampleRequest = {
        activated: true
      };
      request.put('/api/season/1')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.response.league).to.equal('NFL');
          expect(res.body.response.start_date).to.be.an('string');
          expect(res.body.response.active_season).to.equal(true);
          done();
        });
    });
    it('should not edit a season if it doesn\'t exist', (done) => {
      const sampleRequest = {
        league: 'NFL',
        startDate: moment().year('2017').month('11').date('12'),
        endDate: moment().year('2018').month('01').date('13'),
        activated: false
      };
      request.put('/api/season/12')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.response).to.equal('no season found with id: 12');
          done();
        });
    });
  });
  describe('/activate PUT', () => {
    it('should set a season as active', (done) => {
      const sampleRequest = {
        id: '1'
      };
      request.put('/api/season/activate')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.response.active_season).to.equal(true);
          expect(res.body.message).to.equal('season is now active');
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('should not set a season as active if it isn\'t found', (done) => {
      const sampleRequest = {
        id: '12'
      };
      request.put('/api/season/activate')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(404);
          expect(res.body.response).to.equal('no season found with id: 12');
          expect(res.body.message).to.equal('error');
          expect(res.body.status).to.equal(404);
          done();
        });
    });
  });
  describe('/deactivate PUT', () => {
    it('should set a season as inactive', (done) => {
      const sampleRequest = {
        id: '1'
      };
      request.put('/api/season/deactivate')
        .send(sampleRequest)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.response.active_season).to.equal(false);
          expect(res.body.message).to.equal('season is now inactive');
          expect(res.body.status).to.equal(200);
          done();
        });
    });
    it('should not set a season as inactive if it isn\'t found', (done) => {
      const sampleRequest = {
        id: '12'
      };
      request.put('/api/season/deactivate')
        .send(sampleRequest)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(404);
          expect(res.body.response).to.equal('no season found with id: 12');
          expect(res.body.message).to.equal('error');
          expect(res.body.status).to.equal(404);
          done();
        });
    });
  });
});
