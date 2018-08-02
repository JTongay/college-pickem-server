import { AuthService, IAuthService } from '../../src/services';
import { assert } from 'chai';
// import * as sinon from 'sinon';
import { mock, instance, when } from 'ts-mockito';
import 'mocha';

describe('AuthService', () => {

  let mockAuthService: AuthService;

  beforeEach(() => {
    mockAuthService = mock(AuthService);
  });

  it('should generate a token for a given user id', () => {
    let test: AuthService;
    test = instance(mockAuthService);
    assert.ok(mockAuthService, 'booyah');
    when(mockAuthService.generateToken('1')).thenReturn('someToken');
    assert.equal(test.generateToken('1'), 'someToken');
  });
});
