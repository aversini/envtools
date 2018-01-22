describe('test specific for Linux platform', function () {
  beforeAll(function () {
    this.originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', {
      value: 'linux'
    });
  });

  test('default temporary dir was found', () => {
    const getTemporaryDir = require('../../utilities/temporaryDir');
    expect(getTemporaryDir()).toMatch(/envtools-tmp$/);
  });

  test('custom temporary dir was found', () => {
    const getTemporaryDir = require('../../utilities/temporaryDir');
    expect(getTemporaryDir('my-custom')).toMatch(/envtools-tmp\/my-custom$/);
  });

  test('custom root dir was found', () => {
    const getTemporaryDir = require('../../utilities/temporaryDir');
    expect(getTemporaryDir('my-custom', '/tmp')).toEqual(
      '/tmp/envtools-tmp/my-custom'
    );
  });

  afterAll(function () {
    Object.defineProperty(process, 'platform', {
      value: this.originalPlatform
    });
  });
});
