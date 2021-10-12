const crypto = require('crypto');
const users = new Map();
const hashPasswords = (password) => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};

const credentialsAreValid = (usename, password) => {
  const userExists = users.has(usename);
  if (!userExists) return false;

  const currentPasswordHash = users.get(usename).passwordHash;
  return hashPasswords(password) === currentPasswordHash;
};

const authenticationMiddleware = async (ctx, next) => {
  try {
    const authHeader = ctx.request.headers.authorization;
    const credentials = Buffer.from(
      authHeader.slice('basic'.length + 1),
      'base64'
    ).toString();
    const [username, password] = credentials.split(':');
    if (!credentialsAreValid(username, password)) {
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
  users,
  hashPasswords,
  credentialsAreValid,
  authenticationMiddleware,
};
