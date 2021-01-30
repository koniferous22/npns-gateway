import { Connection } from 'typeorm';

type Options = {
  maxAttempts: number;
  timeoutMs: number;
  dbName: string;
};

const DEFAULT_MAX_ATTEMPTS = 100;
const DEFAULT_TIMEOUT_MS = 5000;

export const tryConnectingNAttempts = (
  connection: Connection,
  options?: Options
) =>
  new Promise((resolve, reject) => {
    console.log('Starting db connection attempts');
    let attempt = 0;
    let currentTimeout: null | ReturnType<typeof setTimeout> = null;
    const timeoutPeriod = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const attemptConnection = async () => {
      try {
        await connection.connect();
        if (currentTimeout) {
          clearTimeout(currentTimeout);
        }
        console.log('CONNECTED SUCCESSFULLY');
        resolve(connection);
      } catch (e) {
        if (currentTimeout) {
          clearTimeout(currentTimeout);
        }
        if (attempt >= (options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS)) {
          reject(e);
          // ! prevents spawning new timeouts
          return;
        }
        console.log(
          `ATTEMPT #${attempt + 1} failed: retrying in ${timeoutPeriod}ms`
        );
        console.log(e);
        attempt++;
        currentTimeout = setTimeout(() => {
          attemptConnection();
        }, timeoutPeriod);
      }
    };
    attemptConnection();
  });
