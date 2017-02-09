
# geo-proxy

Redis-based caching proxy for Google Maps API queries.

<img src="https://raw.githubusercontent.com/evanx/geo-proxy/master/docs/readme/main.png"/>

## Use case

We require a local proxy to cache requests to Google Maps API into Redis.

## Installation

### git clone

You can `git clone` et al:
```
git clone https://github.com/evanx/geo-proxy.git
cd geo-proxy
npm install
apiKey=XYZ npm start
```
where we must provide our `apiKey` for the Google Maps API.

### Docker

Alternatively you can build and run via Docker
```
## Docker

You can build as follows:
```
docker build -t geo-proxy https://github.com/evanx/geo-proxy.git
```
from https://github.com/evanx/geo-proxy/blob/master/Dockerfile
```
FROM node:7.5.0
ADD package.json .
RUN npm install
ADD lib lib
CMD ["node", "--harmony", "lib/index.js"]
```

```
docker run geo-proxy
```

## Usage

We must provide our `apiKey` for the Google Maps API.
```
evans@eowyn:~/geo-proxy$ apiKey=$MAPS_API_KEY npm start
```
where in the above example, it is set in the development environment as `MAPS_API_KEY`

We can get JSON content:
```
$ redis-cli get cache-geo-proxy:64bdaff72bfc67deb55326022371ffef3ace9c7b:json | jq '.' | grep status
  "status": "OK",
```
Check the TTL:
```
$ redis-cli ttl cache-geo-proxy:64bdaff72bfc67deb55326022371ffef3ace9c7b:json
(integer) 1814352
```

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
        expireSeconds: {
            description: 'the TTL for the cached content',
            default: 21*24*3600
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
module.exports = async ({config, logger, client, app, api}) => {
    api.get('/maps/api/*', async ctx => {
        const path = ctx.params[0];
        const url = 'https://maps.googleapis.com/maps/api/' + path;
        const qs = ctx.query;
        const sha = crypto.createHash('sha1').update(
            [url, JSON.stringify(qs)].join('#')
        ).digest('hex');
        const cacheKey = [config.redisNamespace, sha, 'content:json'].join(':');
        const [cachedContent] = await multiExecAsync(client, multi => {
            multi.get(cacheKey);
            multi.expire(cacheKey, config.expireSeconds);
        });
        if (cachedContent) {
            ctx.set('Content-Type', 'application/json');
            ctx.body = JSON.stringify(JSON.parse(cachedContent), null, 2);
            return;
        }
        ...
    });
}
```

If not found in the Redis cache, then we fetch:
```javascript
        qs.key = config.apiKey;
        const urlQuery = url + '?' + Object.keys(qs)
        .map(key => [key, encodeURIComponent(qs[key])].join('='))
        .join('&');
        const res = await fetch(urlQuery);
        if (res.status !== 200) {
            ctx.statusCode = res.status;
            ctx.body = res.statusText + '\n';
            return;
        }
```

Naturally we put successfully fetched content into our Redis cache:
```javascript
        const fetchedContent = await res.text();
        const formattedContent = JSON.stringify(JSON.parse(fetchedContent), null, 2);
        ctx.set('Content-Type', 'application/json');
        ctx.body = formattedContent;
        await multiExecAsync(client, multi => {
            multi.setex(cacheKey, config.expireSeconds, formattedContent);
        });
```

### Appication archetype

Incidently `lib/index.js` uses the `redis-koa-app-rpf` application archetype.
```
require('redis-koa-app-rpf')(require('./spec'), require('./main'));
```
where we extract the `config` from `process.env` according to the `spec` and invoke our `main` function.

See https://github.com/evanx/redis-koa-app-rpf.

This provides lifecycle boilerplate to reuse across similar applications.

<hr>
https://twitter.com/@evanxsummers
