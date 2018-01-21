const log = require('fedtools-logs');
const inquirer = require('inquirer');

const _displayConfirmation = (msg, done) => {
  const questions = {
    type: 'confirm',
    name: 'goodToGo',
    message: msg,
    default: true
  };
  log.echo();
  inquirer.prompt(questions).then(function (answers) {
    done(!answers.goodToGo);
  });
};

const _displayPromptWithInput = (msg, done) => {
  const questions = {
    type: 'input',
    name: 'input',
    message: msg,
    validate(val) {
      if (!val) {
        return 'Entry cannot be empty...';
      }
      return true;
    }
  };
  log.echo();
  inquirer.prompt(questions).then(function (answers) {
    done(null, answers.input);
  });
};

const _displayPromptWithPassword = (msg, done) => {
  const questions = {
    type: 'password',
    name: 'password',
    message: msg,
    validate(val) {
      if (!val) {
        return 'Password cannot be empty...';
      }
      return true;
    }
  };
  log.echo();
  inquirer.prompt(questions).then(function (answers) {
    done(null, answers.password);
  });
};

const _displayListOfOptions = (msg, options, done) => {
  const questions = {
    type: 'list',
    name: 'selection',
    message: msg
  };
  questions.choices = options;
  log.echo();
  inquirer.prompt(questions).then(function (answers) {
    done(null, answers.selection);
  });
};

exports.displayConfirmation = _displayConfirmation;
exports.displayPromptWithInput = _displayPromptWithInput;
exports.displayPromptWithPassword = _displayPromptWithPassword;
exports.displayListOfOptions = _displayListOfOptions;
