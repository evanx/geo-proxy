
# geo-proxy



## Use case

## Usages

## Config spec

See `lib/spec.js` https://github.com/evanx/geo-proxy/blob/master/lib/spec.js
```javascript
```

## Implementation

See `lib/main.js` https://github.com/evanx/geo-proxy/blob/master/lib/main.js
```javascript
```

### Appication archetype

Incidently `lib/index.js` uses the `redis-http-app-rpf` application archetype.
```
require('./redis-http-app-rpf')(require('./spec'), require('./main'));
```
where we extract the `config` from `process.env` according to the `spec` and invoke our `main` function.

That archetype is embedded in the project, as it is still evolving. Also, you can find it at https://github.com/evanx/redis-http-app-rpf.

This provides lifecycle boilerplate to reuse across similar applications.

## Docker

You can build as follows:
```
docker build -t geo-proxy https://github.com/evanx/geo-proxy.git
```
from https://github.com/evanx/geo-proxy/blob/master/Dockerfile

<hr>
https://twitter.com/@evanxsummers
