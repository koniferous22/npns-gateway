# npns-gateway

## Generating migrations
* Postgres (via typeorm)
  * `npm run orm -- migration:generate -c <<CONNECTION>> -n <<MIGRATION_NAME>>`
    * `<<CONNECTION>>: 'account' | 'tag'`
    * `<<MIGRATION_NAME>>: string // whatever`
  * Executing in docker compose:
    * `docker-compose exec -- gateway npm run orm -- migration:generate -c <<CONNECTION>> -n <<MIGRATION_NAME>>`
* Mongo (via external tool, **NOT AUTOMATIC**, sadly typeorm isn't that good)
  * `npm run migrate:mongo create <<MIGRATION_NAME>>`
  * Migration has to be written manually\
    * https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  * Executing in docker compose 
    * `docker-compose exec -- gateway npm run migrate:mongo create <<MIGRATION_NAME>>`
