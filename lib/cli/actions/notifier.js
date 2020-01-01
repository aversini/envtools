const path = require("path");
const common = require("../../common");
const notifier = require("node-notifier");

module.exports = function(self, program) {
  const config = {};
  const TYPES = {
    INFO: {
      sound: program.sound || "Purr",
      icon: path.join(common.ENVTOOLS.THIRDDIR, "notifier", "info.png")
    },
    SUCCESS: {
      sound: program.sound || "Glass",
      icon: path.join(common.ENVTOOLS.THIRDDIR, "notifier", "success.png")
    },
    QUESTION: {
      sound: program.sound || "Funk",
      icon: path.join(common.ENVTOOLS.THIRDDIR, "notifier", "question.png")
    },
    TIMER: {
      sound: program.sound || "Purr",
      icon: path.join(common.ENVTOOLS.THIRDDIR, "notifier", "timer.png")
    },
    WARNING: {
      sound: program.sound || "Blow",
      icon: path.join(common.ENVTOOLS.THIRDDIR, "notifier", "warning.png")
    },
    ERROR: {
      sound: program.sound || "Blow",
      icon: path.join(common.ENVTOOLS.THIRDDIR, "notifier", "error.png")
    }
  };

  const type = program.type ? program.type.toUpperCase() : "INFO";

  config.title = program.title || "Envtools Notification";
  config.message = program.message || "Notification Example";

  if (TYPES[type]) {
    config.sound = TYPES[type].sound;
    config.contentImage = TYPES[type].icon;
  }

  notifier.notify(config);
};
