// https://www.npmjs.com/package/migrate-mongo
// In this file you can configure migrate-mongo

module.exports = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: `mongodb://${process.env.CHALLENGE_DB_USERNAME}:${process.env.CHALLENGE_DB_PASSWORD}@${process.env.CHALLENGE_DB_HOST}:${process.env.CHALLENGE_DB_PORT}/${process.env.CHALLENGE_DB_DATABASE}`,

    // TODO Change this to your database name:
    databaseName: process.env.CHALLENGE_DB_DATABASE,

    options: {
      useNewUrlParser: true // removes a deprecation warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'src/challenge-service/migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'changelog',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.js'
};
