/**
 * @jest-environment jsdom
 */

const fs = require('fs');
window.document.body.innerHTML = fs.readFileSync('./public/index.html');
const { incrementCount, data } = require('./main');

describe('incrementCount', () => {
  test('incrementing the count', () => {
    data.cheesecake = 0;
    incrementCount();
    expect(data.cheesecake).toBe(1);
  });
});
