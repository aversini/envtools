const fs = require('fs-extra');
const path = require('path');
const filename1 = 'file-to-backup-1.txt';
const filename2 = 'file-to-backup-2.txt';
const filename3 = 'file-to-backup-3.txt';
const file1 = path.join(__dirname, '..', 'mockdata', 'backup', filename1);
const file2 = path.join(__dirname, '..', 'mockdata', 'backup', filename2);
const file3 = path.join(__dirname, '..', 'mockdata', 'backup', filename3);
const tmpMockDir = path.join(__dirname, '..', 'mockdata', 'tmp');

describe('utilities#backup', () => {
  beforeAll(function () {
    this.originalHome = process.env.HOME;
    fs.emptydirSync(tmpMockDir);
    Object.defineProperty(process.env, 'HOME', {
      value: tmpMockDir
    });
  });
  it('should copy one file to the backup folder', (done) => {
    const backup = require('../../utilities/backup');
    const backupDir = backup(file1);
    fs.readFile(path.join(backupDir, filename1), 'utf8', (e, d) => {
      expect(e).toBeNull;
      expect(d).toEqual('[1] I am a file that should be backed-up.\n');
      done();
    });
  });
  it('should copy 2 files to the backup folder', (done) => {
    const backup = require('../../utilities/backup');
    const backupDir = backup([file2, file3]);
    fs.readFile(path.join(backupDir, filename2), 'utf8', (e, d) => {
      expect(e).toBeNull;
      expect(d).toEqual('[2] I am a file that should be backed-up.\n');
      fs.readFile(path.join(backupDir, filename3), 'utf8', (e, d) => {
        expect(e).toBeNull;
        expect(d).toEqual('[3] I am a file that should be backed-up.\n');
        done();
      });
    });
  });
  afterAll(function () {
    Object.defineProperty(process.env, 'HOME', {
      value: this.originalHome
    });
  });
});
