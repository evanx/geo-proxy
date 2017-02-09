
const crypto = require('crypto');
const fetch = require('fetch');

module.exports = async ({config, logger, client, app, api}) => {
    api.post(`/*`, async ctx => {
        const path = ctx.params[0];
        ctx.set('Content-Type', 'application/json');
        const url = 'https://maps.googleapis.com/' + path;
        ctx.body = {
            url,
            query
        };
    });
}
