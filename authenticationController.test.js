const crypto = require('crypto');
const {
  hashPasswords,
  credentialsAreValid,
  authenticationMiddleware,
} = require('./authenticationController');
const { db, closeConnection } = require('./dbConnection');
beforeEach(() => db('users').truncate());
afterAll(() => closeConnection());

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
  test('validating credentials', async () => {
    await db('users').insert({
      username: 'test_user',
      email: 'test_user@example.com',
      passwordHash: hashPasswords('test_password'),
    });

    const hasValidCredentials = await credentialsAreValid(
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
    await db('users').insert({
      username: 'test_user',
      email: 'test_user@example.com',
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
