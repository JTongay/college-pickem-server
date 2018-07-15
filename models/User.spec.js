process.env.NODE_ENV = 'test';

const chai = require('chai');

const expect = chai.expect;
const User = require('./User');
const knex = require('../db/conf');

describe('User model', () => {

  beforeEach((done) => {
    knex.migrate.latest().then(() => {
      knex.seed.run().then(() => {
        done();
      })
    })
  });

  afterEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        done();
      });
  });

  it('should getUser() with a valid id', async () => {
    const result = await User.getUser(1);
    expect(result).to.be.an('Object');
  });

  it('should not getUser() with an invalid id', async () => {
    const result = await User.getUser(1234);
    expect(result).to.equal(undefined);
  });

});
