# Ody test API

This is an api for the Ody test project.

The API is built with NestJS and uses a Postgres database provided by a docker container.
The code architecture tries to follow _DDD_ and _clean architecture_ principles, by separating the business logic from the framework.
The business logic is located in the `src/domain` folder.

## Usage

To launch the db:

```bash
docker-compose up -d
```

To launch the api:

```bash
pnpm run start:dev
```

(or `npm` or `yarn`)

To access API documentation:
http://localhost:3000/api

## Tests

unit tests & integration tests:

```bash
pnpm run test
```

e2e tests:

```bash
pnpm run test:e2e
```

credentials for the testing purpose: `user1@email.com` - `password`

## Some remarks

### Genral Remarks

- The API is not fully tested, but the main features are.
- The clean architecture implementation here is an experiment, as I never used it in a real project. It is still a recommended practice. It helps decoupling the business logic from the infrastructure, and makes the code more testable. On the other hand, it adds a layer of comBut I think there is room for improvement in the structure of the code (a monorepo maybe with a domain library, and a separate infrastructure library).
- I didn't use an ORM such as TypeORM but I could have. I used slonik to directly write SQL queries. I think it's a good practice to know how to write SQL queries, and it's not that hard. It also allows to have more control over the queries.
- The data of the database are commited for convenience in the test, but to allow better control over the data we should provide a seed file to populate the database when it's created.

### About the auth mecanism and webhook security

- The auth mecanism consists of an JWT based autentication system for user authentication.
- The password is not hashed here just for convenience and to keep this part simple, but of course it should be hashed.
- Once the User is logged in, he can generate a AccountKey and sign secret to access the webhook API.
- The AccounKey has an id part and a key part, base64 encoded. The key hash is stored in the database, so there is no way to retrieve it. It's an emit once system. The secret is stored in db as well. The secret is used to sign the webhook data.
- The AccountKey is use in the `partners/travels/record` POST endpoint to send data to the API. To send data, the user must provide an accountKey, along side with a x-signature header containing a hmac sha256 signature of a json stringified body of `{payload: <bodyOfTheRequest>, timestamp: <timestampOfTheRequest>}`. The secret is used to sign the data. The timestamp is used to prevent replay attacks.
  Here is an example of how to generate the signature in nodejs:

```ts
const crypto = require('crypto');
const timestamp = Date.now().toString();

const signature = crypto
  .createHmac('sha256', signSecret)
  .update(JSON.stringify({ payload: travelInfoBase, timestamp }))
  .digest('base64');

fetch('http://localhost:3000/partners/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'account-key': accountKey,
    'x-signature': signature,
    'x-timestamp': timestamp,
  },
  body: JSON.stringify(travelInfoBase),
});
```

- To add a level of security while preserving good performance in case a token or account key is compromised we could add a cache system (like Redis) to store the whitelisted tokens and account keys. This way we could check if the token or account key is in the cache before checking the database.

- I didn't add SSL for local development, but of course it is a must have for production.

- The signing secret is symetric, we could also use an asymetric secret (public/private key) to sign the data. This way the secret would not be stored in the database, and the signature would be verified with the public key. However this requires more work on the user side, and makes key rotation more difficult to manage. On the other hand it could add a non-reputability feature to the system if needed.
