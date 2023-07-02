const { quiz } = require("../controllers/quiz");
const generateQuestion = require("../lib/generator-questions");

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").FastifyPluginOptions} options
 * @param {import("fastify").FastifyPluginCallback} done
 */
module.exports = function (fastify, options, done) {
    fastify.addHook('preHandler', require('./middlewares/auth'));
    fastify.get('/:studyListId', quiz);
    done();
}