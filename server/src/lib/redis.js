const { createClient } = require('redis');

const client = createClient({
    url: 'redis://redis:6379'
});

async function keys(exp) {
    await client.connect();
    const keys = await client.keys(exp);
    await client.disconnect();
    return keys;
}

async function get(key) {
    await client.connect();
    const value = await client.get(key);
    await client.disconnect();
    return value;
}

async function set(key, value) {
    await client.connect();
    await client.set(key, value, {
        EX: 3600
    });
    await client.disconnect();
}

async function del(key) {
    await client.connect();
    await client.del(key)
    await client.disconnect();
}

module.exports = { get, set, keys, del };