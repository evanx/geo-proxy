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
        apiKey: {
            description: 'our Google Maps API key'
        },
        loggerLevel: {
            description: 'the logging level',
            default: 'info',
            example: 'debug'
        }
    },
    test: {
        loggerLevel: 'info'
    },
    development: {
        loggerLevel: 'info'
    }
}
