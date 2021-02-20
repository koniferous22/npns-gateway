import path from 'path';

export default [
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
