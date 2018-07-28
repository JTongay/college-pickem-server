import { IUserController } from '../../src/controllers/index';
import { assert } from 'chai';
import * as sinon from 'sinon';
import 'mocha';

describe('User Controller', () => {

  let UserController: IUserController;

  beforeEach(() => {
    // UserController = sinon.mock(UserController);
  });

  it('should pass the test', () => {
    assert.equal(true, true);
  });

  xit('should have the findJoey method', () => {
    // UserController.spy('getJoey');
    const test = sinon.spy(UserController, 'getJoey')
    assert.isDefined(UserController.getJoey, 'is a function');
  });

});
