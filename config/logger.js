const winston = require('winston');
const path = require('path');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, json } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let log = `${timestamp} [${level.toUpperCase()}] ${message}`;

    if (Object.keys(metadata).length > 0) {
        log += `\n${JSON.stringify(metadata, null, 2)}`;
    }

    return log;
});

// Create the logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
require('fs').existsSync(logsDir) || require('fs').mkdirSync(logsDir);

// Define different formats for different environments
const devFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    logFormat
);

const prodFormat = combine(
    timestamp(),
    format.errors({ stack: true }),
    json()
);

// Create logger instance
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
    defaultMeta: { service: 'user-management-service' },
    transports: [
        // Write all logs with level `error` and below to `error.log`
        new transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs with level `info` and below to `combined.log`
        new transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
    exitOnError: false, // Don't exit on handled exceptions
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: devFormat,
    }));
}

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message) {
        // Use the 'info' log level so the output will be picked up by both transports
        logger.info(message.trim());
    },
};

module.exports = logger;
