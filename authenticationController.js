const crypto = require('crypto');
const hashPasswords = (password) => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};
const { db } = require('./dbConnection');

const credentialsAreValid = async (username, password) => {
  const user = await db('users').select().where({ username }).first();

  if (!user) return false;

  return hashPasswords(password) === user.passwordHash;
};

const authenticationMiddleware = async (ctx, next) => {
  try {
    const authHeader = ctx.request.headers.authorization;
    const credentials = Buffer.from(
      authHeader.slice('basic'.length + 1),
      'base64'
    ).toString();
    const [username, password] = credentials.split(':');
    const validCredentialsSent = await credentialsAreValid(username, password);
    if (!validCredentialsSent) {
      throw new Error('invalid credentials');
    }
  } catch (e) {
    ctx.status = 401;
    ctx.body = { message: 'please provide valid credentials' };
    return;
  }
  await next();
};

module.exports = {
  hashPasswords,
  credentialsAreValid,
  authenticationMiddleware,
};
