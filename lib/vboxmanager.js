#!/usr/bin/env node

var
  _ = require('underscore'),
  log = require('fedtools-logs'),
  inquirer = require('inquirer'),
  vb = require('./vb'),
  optimist,
  program,
  START_COMMAND = 'start',
  STOP_COMMAND = 'stop',
  VirtualBoxManager;


// -- C O N S T R U C T O R

VirtualBoxManager = function () {
  if (!VirtualBoxManager._instance) {
    VirtualBoxManager._instance = this;
  }
  this.init();
};
VirtualBoxManager.prototype.name = 'VirtualBoxManager';

// -- P R I V A T E  M E T H O D S

VirtualBoxManager.prototype._validateCommand = function (program) {
  if (!_.isBoolean(program.start) && !_.isBoolean(program.stop)) {
    return false;
  } else {
    this.headless = _.isBoolean(program.headless) ? program.headless : false;
    this.qualifiedCommand = _.isBoolean(program.start) ? START_COMMAND : STOP_COMMAND;
    return true;
  }
};

VirtualBoxManager.prototype._runCommand = function (vmName, done) {
  var
    self = this;

  function _logFeedback(err) {
    var
      headlessMsg = (self.headless) ? ' (headless mode)' : '',
      msg = (self.qualifiedCommand === STOP_COMMAND) ? ' was stopped' : ' was started';
    log.success('Virtual machine ' + vmName + msg + headlessMsg);
    done(err);
  }

  if (self.qualifiedCommand === START_COMMAND) {
    vb.start(vmName, !self.headless, _logFeedback);
  } else {
    vb.stop(vmName, _logFeedback);
  }
};

// -- P U B L I C  M E T H O D S

VirtualBoxManager.prototype.init = function () {
  var
    maxLen = 20,
    vmList = [new inquirer.Separator('')],
    self = this;

  self.availableVms = [];

  vb.list(function (err, data) {
    if (err) {
      throw new Error(err);
    }
    _.each(data, function (vm) {
      if (vm.name.length > maxLen) {
        maxLen = vm.name.length;
      }
      vmList.push(vm);
      self.availableVms.push(vm);
    });
    vmList = _.sortBy(vmList, 'name');
    self.availableVms = _.sortBy(self.availableVms, 'name');
    optimist = require('optimist')
      .usage(log.strToColor('cyan', 'Usage: ') + 'vm --start|--stop --headless')
      .describe(START_COMMAND, 'start or resume a virtual machine')
      .describe(STOP_COMMAND, 'suspend a virtual machine')
      .describe('headless', 'start the VM without the GUI');

    program = optimist.argv;

    if (!self._validateCommand(program)) {
      optimist.showHelp();
      if (vmList.length > 0) {
        log.rainbow(log.strToColor('cyan', 'Available Virtual Machines:\n'));
        _.each(self.availableVms, function (vm) {
          var
            str = vm.name,
            len = maxLen - str.length;

          str = 'Vm: ' + str + ' ' + new Array(len + 1).join('.');
          log.echo(str + ' Running: ' + vm.running);
        });
      }
      log.echo();
      process.exit(0);
    } else {
      // need to enable/disable options based on the the requested
      // command (start or stop) and the current running status of
      // each vm
      vmList = _.filter(self.availableVms, function (vm) {
        if ((self.qualifiedCommand === START_COMMAND && !vm.running) ||
          (self.qualifiedCommand === STOP_COMMAND && vm.running)) {
          return true;
        } else {
          return false;
        }
      });

      if (vmList.length === 0) {
        log.echo();
        if (self.qualifiedCommand === START_COMMAND) {
          log.notice('All VMs are currently running, nothing to start...');
        } else {
          log.notice('All VMs are currently suspended, nothing to stop...');
        }
        log.echo();
        process.exit(0);
      }

      inquirer.prompt([{
        type: 'checkbox',
        message: 'Select at least one virtual machine',
        name: 'vms',
        choices: vmList,
        validate: function (answer) {
          if (answer.length < 1) {
            log.echo('\n\nNo VM choosen, bye then...');
            process.exit(0);
          }
          return true;
        }
      }]).then(function (answers) {
        _.each(answers.vms, function (vm) {
          self._runCommand(vm, function () {
            // nothing to declare
          });
        });
      });
    }
  });
};


(function () {
  return VirtualBoxManager._instance || new VirtualBoxManager();
})();
