import { utilities, WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

export const LoggerFactory = (appName: string | 'NEST') => {
  // Error
  const errorFileTransport = new transports.DailyRotateFile({
    filename: `src/logs/%DATE%-error.log`,
    level: 'error',
    format: format.combine(format.timestamp(), format.json()),
    datePattern: 'YYYY-MM-DD',
  });

  // All levels
  const allFileTransport = new transports.DailyRotateFile({
    filename: `src/logs/%DATE%-general.log`,
    format: format.combine(format.timestamp(), format.json()),
    datePattern: 'YYYY-MM-DD',
  });

  const consoleTransport = new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.ms(),
      utilities.format.nestLike(appName, {
        colors: true,
        prettyPrint: true,
      }),
    ),
  });

  return WinstonModule.createLogger({
    transports: [errorFileTransport, allFileTransport, consoleTransport],
  });
};
