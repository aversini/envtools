// const fs = require('fs-extra');
// const path = require('path');
const cryptographer = require('../utilities/cryptographer');

// const encryptedFile = path.join(__dirname, 'mockdata', 'crypto', 'file1-e.txt');
// const rawFile = path.join(__dirname, 'mockdata', 'crypto', 'file1-r.txt');
// const outputDir = path.join(__dirname, 'tmp', 'mocka');
const PASSWORD = 'cgu4]wPJyCc8g';

describe('utilities#cryptographer', () => {
  // beforeEach(() => {
  //   fs.emptydirSync(outputDir);
  // });
  // it('should throw if missing -f argument', () => {
  //   expect(() => {
  //     cryptographer.prompt();
  //   }).toThrow();
  // });
  // it('should throw if file does not exist', () => {
  //   expect(() => {
  //     cryptographer.prompt({
  //       file: 'no-such-file.txt'
  //     });
  //   }).toThrow('Invalid argument, file is missing');
  // });
  // it('should decrypt an encrypted file', (done) => {
  //   const output = path.join(outputDir, 'file1-unsecured.txt');
  //   cryptographer.prompt(
  //     {
  //       file: encryptedFile,
  //       output,
  //       status: false,
  //       password: PASSWORD,
  //       encrypt: false
  //     },
  //     (err) => {
  //       expect(err).toBeNull;
  //       fs.readFile(output, 'utf8', (e, d) => {
  //         expect(e).toBeNull;
  //         expect(d).toEqual('Hello World!\n');
  //         done();
  //       });
  //     }
  //   );
  // });
  //
  // it('should encrypt/decrypt a file', (done) => {
  //   const output = path.join(outputDir, 'file1-secured.txt');
  //   const output2 = path.join(outputDir, 'file1-raw.txt');
  //
  //   cryptographer.prompt(
  //     {
  //       file: rawFile,
  //       output,
  //       status: false,
  //       password: PASSWORD,
  //       encrypt: true
  //     },
  //     (err) => {
  //       expect(err).toBeNull;
  //       cryptographer.prompt(
  //         {
  //           file: output,
  //           output: output2,
  //           status: false,
  //           password: PASSWORD,
  //           encrypt: false
  //         },
  //         (err) => {
  //           expect(err).toBeNull;
  //           fs.readFile(output2, 'utf8', (e, d) => {
  //             expect(e).toBeNull;
  //             expect(d).toEqual('Hello World!\n');
  //             done();
  //           });
  //         }
  //       );
  //     }
  //   );
  // });

  it('should create the same hash for a string (default algo)', () => {
    const data = 'Hello World!!!';
    const hash1 = cryptographer.createHash(data);
    const hash2 = cryptographer.createHash(data);
    const hash3 = cryptographer.createHash(data);

    expect(hash1).toEqual(hash2);
    expect(hash2).toEqual(hash3);
  });

  it('should create the same hash for a string (algo set to sha1)', () => {
    const data = 'Hello World!!!';
    const algo = 'sha1';
    const hash1 = cryptographer.createHash(data, algo);
    const hash2 = cryptographer.createHash(data, algo);
    const hash3 = cryptographer.createHash(data, algo);

    expect(hash1).toEqual(hash2);
    expect(hash2).toEqual(hash3);
  });


  it('should create different hash for a string with a different algorithm', () => {
    const data = 'Hello World!!!';
    const hash1 = cryptographer.createHash(data);
    const hash2 = cryptographer.createHash(data, 'sha1');
    const hash3 = cryptographer.createHash(data, 'sha256');

    expect(hash1).not.toEqual(hash2);
    expect(hash2).not.toEqual(hash3);
    expect(hash1).not.toEqual(hash3);
  });

  it('should encrypt/decrypt a string', () => {
    const data = 'Hello World!!!';
    const encrypted = cryptographer.encrypt(PASSWORD, data);
    const decrypted = cryptographer.decrypt(PASSWORD, encrypted);
    expect(decrypted).toEqual(data);
  });
});
