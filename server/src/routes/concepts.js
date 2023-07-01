const { register, update, list, get, remove } = require('../controllers/concepts');

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").FastifyPluginOptions} options
 * @param {import("fastify").FastifyPluginCallback} done
 */
module.exports = function(fastify, options, done) {
    fastify.addHook('preHandler', require('./middlewares/auth'));
    fastify.get('/', list);
    fastify.get('/:id', get);
    fastify.post('/', register);
    fastify.put('/:id', update);
    fastify.delete('/:id', remove);
    done();
}