const http = require("http");
const handler = require("serve-handler");
const compression = require("compression");
const opn = require("opn");
const { promisify } = require("util");

const _ = require("lodash/core");
const log = require("fedtools-logs");
const { cyan, green, grey, yellow } = require("kleur");
const fs = require("fs-extra");
const portfinder = require("portfinder");
const argv = require("yargs")
  .help("info")
  .boolean(["C", "l", "o", "u"])
  .alias("c", "cache")
  .alias("C", "cors")
  .alias("l", "logs")
  .alias("o", "open")
  .alias("p", "port")
  .alias("u", "unzipped").argv;
const common = require("../../common");

const GRACEFUL_SERVER_CLOSE_DELAY = 3000;
const DEFAULT_PORT = 8080;
const DEFAULT_CACHE = 0;
const DEFAULT_CORS = false;
const DEFAULT_GZIP = true;
const DEFAULT_LOGS = false;
const DEFAULT_OPEN = false;
const DEFAULT_PUBLIC = process.cwd();
const DEFAULT_HEADERS = {
  "X-Powered-By": `${common.ENVTOOLS.NAME} ${common.ENVTOOLS.VERSION}`
};

module.exports = function() {
  const usage = () => {
    log.echo();
    log.rainbow(
      `  Usage: ${yellow("envtools web")} ${grey("[option] [path]")}`
    );
    log.echo();
    log.echo("  Path:");
    log.rainbow(
      `${grey("    The path to serve files from (Default: current folder)")}`
    );
    log.echo();
    log.echo("  Options:");
    log.echo();
    log.rainbow(
      `${yellow("    -c, --cache")} ${grey(
        "    Time in milliseconds for caching files (Default: 0)"
      )}`
    );
    log.rainbow(
      `${yellow("    -C, --cors")} ${grey(
        "     Setup * CORS headers to allow requests from any origin (Default: disabled)"
      )}`
    );
    log.rainbow(
      `${yellow("    -h, --help")} ${grey("     Output usage information")}`
    );
    log.rainbow(
      `${yellow("    -o, --open")} ${grey(
        "     Open in your default browser (Default: false)"
      )}`
    );
    log.rainbow(
      `${yellow("    -l, --logs")} ${grey(
        "     Print http requests (Default: disabled)"
      )}`
    );
    log.rainbow(
      `${yellow("    -p, --port <n>")} ${grey(
        " Port to listen on - Will try next available if already used (Default: 8080)"
      )}`
    );
    log.rainbow(
      `${yellow("    -u, --unzipped")} ${grey(
        " Disable GZIP compression (Default: false)"
      )}`
    );
  };

  const parseOptions = () => {
    const config = {
      headers: DEFAULT_HEADERS,
      public: DEFAULT_PUBLIC
    };

    config.port = _.isNumber(argv.port) ? argv.port : DEFAULT_PORT;
    config.cache = _.isNumber(argv.cache) ? argv.cache : DEFAULT_CACHE;
    config.cors = _.isBoolean(argv.cors) || DEFAULT_CORS;
    config.logs = _.isBoolean(argv.logs) || DEFAULT_LOGS;
    config.open = _.isBoolean(argv.open) || DEFAULT_OPEN;
    config.gzip = _.isBoolean(argv.unzipped) ? !argv.unzipped : DEFAULT_GZIP;

    if (argv._ && argv._[1]) {
      if (fs.pathExistsSync(argv._[1])) {
        config.public = argv._[1];
      } else {
        log.error(`Folder ${argv._[1]} does not exist...`);
        process.exit(1);
      }
    }

    return config;
  };

  const printHttpLogs = req => {
    const now = new Date();
    log.rainbow(
      `${grey("[ ")}${grey(now.toDateString())} ${grey(
        now.toLocaleTimeString()
      )}${grey(" ]")} ${green(req.method)} ${cyan(req.url)}`
    );
  };

  const registerShutdown = callback => {
    let run = false;

    const wrapper = () => {
      if (!run) {
        run = true;
        return callback();
      }
    };

    process.on("SIGINT", wrapper);
    process.on("SIGTERM", wrapper);
    process.on("exit", wrapper);
  };

  const startServer = config => {
    const compressionHandler = promisify(compression());

    const serverHandler = async (req, res, err) => {
      if (config.cors) {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }

      if (config.cache === 0) {
        res.setHeader(
          "Cache-Control",
          "max-age=0, no-cache, no-store, must-revalidate"
        );
      } else {
        res.setHeader("Cache-Control", `max-age=${config.cache}`);
      }

      if (config.gzip) {
        await compressionHandler(req, res);
      }
      if (config.logs) {
        printHttpLogs(req, res, err);
      }
      return handler(req, res, config);
    };

    const server = http.createServer(serverHandler);

    server.on("error", err => {
      log(err);
      process.exit(1);
    });

    portfinder.getPort({ port: config.port }, (err, port) => {
      if (err) {
        throw err;
      } else if (port && port !== config.port) {
        log.error(`Port ${config.port} is not available...`);
        log.warning(`Using next available instead: ${port}`);
        log.echo();
      }
      config.port = port;
      server.listen(config.port, "0.0.0.0", async () => {
        registerShutdown(() => {
          setTimeout(() => {
            log.echo("Force-closing all open sockets...");
            process.exit(0);
          }, GRACEFUL_SERVER_CLOSE_DELAY);
          server.close();
        });
        const url = `http://localhost:${config.port}`;
        const msg = [];
        msg.push("Simple web server is up and running.\n");
        msg.push("URL is now available here:");
        msg.push(log.strToColor("cyan", url));
        msg.push("\nHit CTRL-C to stop the server.");
        log.printMessagesInBox(msg);

        if (config.open) {
          opn(url, {
            url: true,
            wait: false
          });
        }
      });
    });
  };

  (async () => {
    if (argv.h || argv.help) {
      usage();
    } else {
      startServer(parseOptions());
      registerShutdown(() => {
        log.echo();
        log.echo("Gracefully shutting down. Please wait...");

        process.on("SIGINT", () => {
          log.echo("Force-closing all open sockets...");
          process.exit(0);
        });
      });
    }
  })();
};
