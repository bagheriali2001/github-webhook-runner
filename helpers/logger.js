const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const loggerFormat = printf(({ level, message , timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const log = createLogger({
    // level: 'silly',
    format: combine(
        timestamp(),
        loggerFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: './logs/error.log', level: 'error' }),
        new transports.File({ filename: './logs/combined.log' })
    ]
});

module.exports = log;