/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").FastifyPluginOptions} options
 * @param {import("fastify").FastifyPluginCallback} done
 */

module.exports = function (fastify, options, done) {
    fastify.register(require('./auth'));
    fastify.register(require('./study-lists'), { prefix: '/study-lists' });
    fastify.register(require('./concepts'), { prefix: '/concepts' });
    fastify.register(require('./quiz'), { prefix: '/quiz' });
    done();
}