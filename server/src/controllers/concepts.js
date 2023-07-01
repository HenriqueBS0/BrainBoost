const prisma = require("../lib/prisma")

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function register(request, reply) {
    const { studyListId, title, description } = request.body;

    await prisma.concept.create({
        data: {
            studyListId: Number(studyListId),
            title,
            description
        }
    });

    reply.send();
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function update(request, reply) {
    const { title, description } = request.body;

    const id = Number(request.params.id);

    await prisma.concept.update({
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
    reply.send(await prisma.concept.findMany({
        where: {
            studyListId: request.body.studyListId
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
    reply.send(await prisma.concept.findUnique({
        where: { id: Number(request.params.id) }
    }));
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function remove(request, reply) {
    await prisma.concept.delete({ where: { id: Number(request.params.id) } });
    reply.send();
}

module.exports = { register, update, list, get, remove }