const { verify, decode } = require("../../lib/jwt-token");
const prisma = require("../../lib/prisma");

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply
 */
module.exports = async function (request, reply) {
    const token = request.headers.authorization;

    if (!token) {
        reply.status(401).send();
        return;
    }

    try {
        verify(token);

        const dados = JSON.parse(decode(token).sub);

        if((Number(dados.time) + (1000*60*process.env.TIME_SESSION)) < (new Date()).getTime()) {
            reply.status(401).send();
            return;
        }

        const clientId = Number(dados.id);

        if ((await prisma.client.findUnique({ where: { id: clientId} })) === null) {
            reply.status(401).send();
            return;
        }

        request.body = { ...request.body, clientId };

    } catch (error) {
        reply.status(401).send();
        return;
    }
}