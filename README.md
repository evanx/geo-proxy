
# geo-proxy

Redis-based caching proxy for Google Maps API queries.

## Use case

We require a local proxy to cache requests to Google Maps API into Redis.

## Usage

We must provide our `apiKey` for the Google Maps API.
```
evans@eowyn:~/geo-proxy$ apiKey=$MAPS_API_KEY node --harmony lib/index.js
```
where in the above example, it is set in the development environment as `MAPS_API_KEY`

## Config spec

See `lib/spec.js` https://github.com/evanx/geo-proxy/blob/master/lib/spec.js
```javascript
module.exports = {
    description: 'Redis-based caching proxy for Google Maps API queries.',
    required: {
        redisHost: {
            description: 'the Redis host',
            default: 'localhost'
        },
        redisPort: {
            description: 'the Redis port',
            default: 6379
        },
        redisPassword: {
            description: 'the Redis password',
            required: false
        },
        redisNamespace: {
            description: 'the Redis namespace',
            default: 'cache-geo-proxy'
        },
        httpPort: {
            description: 'the HTTP port',
            default: 8888
        },
        loggerLevel: {
            description: 'the logging level',
            default: 'info',
            example: 'debug'
        }
    }
}
```

## Implementation

See `lib/main.js` https://github.com/evanx/geo-proxy/blob/master/lib/main.js
```javascript
```

### Appication archetype

Incidently `lib/index.js` uses the `redis-koa-app-rpf` application archetype.
```
require('./redis-koa-app-rpf')(require('./spec'), require('./main'));
```
where we extract the `config` from `process.env` according to the `spec` and invoke our `main` function.

That archetype is embedded in the project, as it is still evolving. Also, you can find it at https://github.com/evanx/redis-koa-app-rpf.

This provides lifecycle boilerplate to reuse across similar applications.

## Docker

You can build as follows:
```
docker build -t geo-proxy https://github.com/evanx/geo-proxy.git
```
from https://github.com/evanx/geo-proxy/blob/master/Dockerfile

<hr>
https://twitter.com/@evanxsummers
