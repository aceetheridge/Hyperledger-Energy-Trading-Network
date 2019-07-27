let appRoot = require('app-root-path');
var winston = require('winston');
const { combine,align, prettyPrint, timestamp, label, splat, printf, } = winston.format;
const colorizer = winston.format.colorize();
//
// Logging levels
//
const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7,
        text: 8
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow',
        text: 'gray'
    }
};

winston.addColors(config.colors);

let getLabel = function(callingModule){
    let parts = callingModule.filename.split('/');
    return parts[parts.length - 2] + '/' + parts.pop();
};

const formatOutput = printf(msg =>{
    let message = colorizer.colorize('text',msg.message);
    let level = colorizer.colorize(msg.level, msg.level.toUpperCase());
    let ts = colorizer.colorize(msg.level, msg.timestamp);
    let label = colorizer.colorize(msg.level, msg.label)

    return `[${ts}] [${label}] [${level}]: ${message}`
});

let options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        colorize: true,
        level: 'debug',
        handleExceptions: true,
        json: false,
    },
};

let getLogger = function(callingModule){
    // instantiate a new Winston Logger with the settings defined above
    let logger = winston.createLogger({
        format: combine(
            label({label:getLabel(callingModule)}),
            timestamp({format: 'MM-DD-YYYY HH:mm:ss'}),
            splat(),
            align(),
            formatOutput
        ),
        transports: [
            new winston.transports.File(options.file),
            new winston.transports.Console(options.console)
        ],
        exitOnError: false, // do not exit on handled exceptions
    });

    logger.stream = {
        write: function(message, encoding) {
            // use the 'info' log level so the output will be picked up by both transports (file and console)
            logger.info(message);
        },
    };

    return logger
};

module.exports = {getLogger};