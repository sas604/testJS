module.exports = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/migrateDatabases.js',
  setupFilesAfterEnv: [
    '<rootDir>/truncateTables.js',
    '<rootDir>/seedUser.js',
    '<rootDir>/disconnectFromDb.js',
  ],
};
