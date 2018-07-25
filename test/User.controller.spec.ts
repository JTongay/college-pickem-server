import { IUserController } from '../src/controllers';
import { assert } from 'chai';
import * as sinon from 'sinon';
import 'mocha';

describe('User Controller', () => {

  let UserController: any;

  beforeEach(() => {
    UserController = sinon.mock(UserController);
  });

  it('should pass the test', () => {
    assert.equal(true, true);
  });

  it('should have the findJoey method', () => {
    // UserController.spy('getJoey');
    assert.isFunction(UserController.getJoey, 'is a function');
  });

});
