const isAppInstalled = require('../../utilities/isAppInstalled');

test('node is installed', () => {
  expect(isAppInstalled('node')).toBeTruthy();
});

test('not-an-app is not installed', () => {
  expect(isAppInstalled('not-an-app')).toBe(false);
});
