
const crypto = require('crypto');
const fetch = require('node-fetch');
const multiExecAsync = require('multi-exec-async');

module.exports = async ({config, logger, client, app, api}) => {
    api.post('/*', async ctx => {
        const path = ctx.params[0];
        const url = 'https://maps.googleapis.com/' + path;
        const options = {};
        const qs = ctx.request.body;
        logger.debug({path, url, qs});
        const sha = crypto.createHash('sha1').update(
            [url, JSON.stringify(qs)].join('#')
        ).digest('hex');
        const cacheKey = [config.redisNamespace, sha, 'json'].join(':');
        const [cachedContent] = await multiExecAsync(client, multi => {
            multi.get(cacheKey);
            multi.expire(cacheKey, config.expireSeconds);
        });
        if (cachedContent) {
            ctx.set('Content-Type', 'application/json');
            ctx.body = JSON.stringify(JSON.parse(cachedContent), null, 2);
            return;
        }
        qs.key = config.apiKey;
        const res = await fetch(url, {
            method: 'POST',
            body: qs
        });
        if (res.status !== 200) {
            console.log('statusCode', url, res.status, res.statusText, qs);
            ctx.statusCode = res.status;
            ctx.body = res.statusText + '\n';
            return;
        }
        const fetchedContent = await res.text();
        const formattedContent = JSON.stringify(JSON.parse(fetchedContent), null, 2);
        ctx.set('Content-Type', 'application/json');
        ctx.body = formattedContent;
        await multiExecAsync(client, multi => {
            multi.setex(cacheKey, config.expireSeconds, formattedContent);
        });
    });
}
