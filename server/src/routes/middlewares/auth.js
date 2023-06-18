const { verify, decode } = require("../../lib/jwt-token");

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 * @param {import("fastify").DoneFuncWithErrOrRes} done 
 */
module.exports = function (request, reply, done) {
    const token = request.headers.authorization;

    if (!token) {
        reply.status(401).send();
        return;
    }

    try {
        verify(token)
    } catch (error) {
        reply.status(401).send();
        return;
    }

    const { sub: clientId } = decode(token);

    request.body = { ...request.body, clientId: Number(clientId) };

    done();
}