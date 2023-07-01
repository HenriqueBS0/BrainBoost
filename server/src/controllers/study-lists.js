const prisma = require("../lib/prisma")

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function register(request, reply) {
    const { clientId, title, description } = request.body;

    await prisma.studyList.create({ data: { clientId, title, description } });

    reply.send();
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function update(request, reply) {
    const { title, description } = request.body;

    const id = Number(request.params.id);

    await prisma.studyList.update({
        where: { id },
        data: { title, description }
    });

    reply.send();
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function list(request, reply) {
    reply.send(await prisma.studyList.findMany({
        where: {
            clientId: request.body.clientId
        },
        orderBy: {
            id: 'asc'
        }
    }));
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function get(request, reply) {
    reply.send(await prisma.studyList.findUnique({
        where: { id: Number(request.params.id) }
    }));
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function remove(request, reply) {
    await prisma.studyList.delete({ where: { id: Number(request.params.id) } });
    reply.send();
}

module.exports = { register, update, list, get, remove }

