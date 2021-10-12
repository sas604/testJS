const crypto = require('crypto');
const {
  hashPasswords,
  users,
  credentialsAreValid,
  authenticationMiddleware,
} = require('./authenticationController');
afterEach(() => users.clear());

describe('hashPassword', () => {
  test('hashing passwords', () => {
    const plainTextPassword = 'passwors_test';
    const hash = crypto.createHash('sha256');

    hash.update(plainTextPassword);
    const expectedHash = hash.digest('hex');
    const actualHash = hashPasswords(plainTextPassword);
    expect(actualHash).toBe(expectedHash);
  });
});

describe('credentialsAreValid', () => {
  test('validating credentials', () => {
    users.set('test_user', {
      email: 'test_user@example.org',
      passwordHash: hashPasswords('test_password'),
    });

    const hasValidCredentials = credentialsAreValid(
      'test_user',
      'test_password'
    );
    expect(hasValidCredentials).toBe(true);
  });
});

describe('authenticationMiddleware', () => {
  test('returning an error if the credentials are not valid', async () => {
    const fakeAuth = Buffer.from('invalid:credentials').toString('base64');
    const ctx = {
      request: {
        headers: { authorization: `Basic ${fakeAuth}` },
      },
    };
    const next = jest.fn();
    await authenticationMiddleware(ctx, next);
    expect(next.mock.calls).toHaveLength(0);
    expect(ctx).toEqual({
      ...ctx,
      status: 401,
      body: { message: 'please provide valid credentials' },
    });
  });
  test('call next if the credentials are valid', async () => {
    users.set('test_user', {
      email: 'test_user@example.org',
      passwordHash: hashPasswords('test_password'),
    });
    const fakeAuth = Buffer.from('test_user:test_password').toString('base64');
    const ctx = {
      request: {
        headers: { authorization: `Basic ${fakeAuth}` },
      },
    };
    const next = jest.fn();
    await authenticationMiddleware(ctx, next);
    expect(next.mock.calls).toHaveLength(1);
  });
});
