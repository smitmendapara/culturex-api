import _constantUtil from './CXconstant.utils';
const { ERROR_LOG, INFO_LOG, LOG_TIMESTAMP_FORMAT } = _constantUtil;

import { format, createLogger, transports } from 'winston';
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
    format: combine(
        timestamp({ format: LOG_TIMESTAMP_FORMAT }),
        prettyPrint()
    ),
    transports: [
        new transports.Console({
            level: INFO_LOG
        }),
        new transports.Console({
            level: ERROR_LOG,
            stderrLevels: [ERROR_LOG]
        })
    ],
});

export default logger;