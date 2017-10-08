process.env.NODE_ENV = 'test';

const chai = require('chai');

const should = chai.should();
const app = require('../server');
const chaiHttp = require('chai-http');

// const config = require('../db/conf');
// const knex = require('knex')(config);

chai.use(chaiHttp);

describe('#', () => {
  it('#', () => {

  });
});
