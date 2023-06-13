/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").FastifyPluginOptions} options
 * @param {import("fastify").FastifyPluginCallback} done
 */
module.exports = function(fastify, options, done) {
    fastify.get('/', function() {});
    fastify.post('/', function() {});
    done();
}