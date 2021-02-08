import path from 'path';

export default [
  {
    name: 'account',
    type: process.env.ACCOUNT_DB_TYPE,
    host: process.env.ACCOUNT_DB_HOST,
    port: parseInt(process.env.ACCOUNT_DB_PORT ?? '', 10),
    username: process.env.ACCOUNT_DB_USERNAME,
    password: process.env.ACCOUNT_DB_PASSWORD,
    database: process.env.ACCOUNT_DB_DATABASE,
    migrations: [
      path.join(__dirname, 'src/account-service/migrations/**/*.ts')
    ],
    entities: [path.join(__dirname, 'src/account-service/entities/**/*.ts')],
    cli: {
      migrationsDir: 'src/account-service/migrations',
      entitiesDir: 'src/account-service/entities'
    }
  },
  {
    name: 'tag',
    type: process.env.TAG_DB_TYPE,
    host: process.env.TAG_DB_HOST,
    port: parseInt(process.env.TAG_DB_PORT ?? '', 10),
    username: process.env.TAG_DB_USERNAME,
    password: process.env.TAG_DB_PASSWORD,
    database: process.env.TAG_DB_DATABASE,
    migrations: [path.join(__dirname, 'src/tag-service/migrations/**/*.ts')],
    entities: [path.join(__dirname, 'src/tag-service/entities/**/*.ts')],
    cli: {
      migrationsDir: 'src/tag-service/migrations',
      entitiesDir: 'src/tag-service/entities'
    }
  },
  {
    name: 'challenge',
    type: process.env.CHALLENGE_DB_TYPE,
    host: process.env.CHALLENGE_DB_HOST,
    port: parseInt(process.env.CHALLENGE_DB_PORT ?? '', 10),
    username: process.env.CHALLENGE_DB_USERNAME,
    password: process.env.CHALLENGE_DB_PASSWORD,
    database: process.env.CHALLENGE_DB_DATABASE,
    migrations: [
      path.join(__dirname, 'src/challenge-service/migrations/**/*.ts')
    ],
    entities: [path.join(__dirname, 'src/challenge-service/entities/**/*.ts')],
    cli: {
      migrationsDir: 'src/challenge-service/migrations',
      entitiesDir: 'src/challenge-service/entities'
    }
  }
];
