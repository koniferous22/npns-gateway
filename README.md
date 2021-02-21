# npns-gateway

## Generating migrations (Outdated paragraph)
* Mongo (via external tool, **NOT AUTOMATIC**, sadly typeorm isn't that good)
  * `npm run migrate:mongo create <<MIGRATION_NAME>>`
  * Migration has to be written manually\
    * https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  * Executing in docker compose 
    * `docker-compose exec -- gateway npm run migrate:mongo create <<MIGRATION_NAME>>`

## TODO
* Request cacheing
