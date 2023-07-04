const prisma = require("../lib/prisma");
const redis = require('../lib/redis');

const conceptCacheListKey = studyListId => `concept-cache-list-${studyListId}`;
const conceptCacheKey     = conceptId => `concept-cache-${conceptId}`;

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

    await redis.del(conceptCacheListKey(studyListId));

    reply.send();
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function update(request, reply) {
    const { title, description } = request.body;

    const id = Number(request.params.id);

    const concept = await prisma.concept.update({
        where: { id },
        data: { title, description }
    });

    await redis.del(conceptCacheListKey(concept.studyListId));
    await redis.del(conceptCacheKey(id));

    reply.send();
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function list(request, reply) {

    const studyListId = Number(request.query.studyListId);

    console.log(studyListId);

    const listKey = conceptCacheListKey(studyListId);

    const listJson = await redis.get(listKey);

    if(!listJson) {
        const list = await prisma.concept.findMany({
            where: {
                studyListId: studyListId
            },
            orderBy: {
                id: 'asc'
            }
        });

        await redis.set(listKey, JSON.stringify(list));

        reply.send(list);
    }
    else {
        reply.send(JSON.parse(listJson));
    }
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function get(request, reply) {
    const id = Number(request.params.id);

    const conceptKey = conceptCacheKey(id);

    const conceptJson = await redis.get(conceptKey);

    if(!conceptJson) {
        const concept = await prisma.concept.findUnique({
            where: { id }
        });

        await redis.set(conceptKey, JSON.stringify(concept));

        reply.send(concept);
    }
    else {
        reply.send(JSON.parse(conceptJson));
    }
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function remove(request, reply) {
    const id =  Number(request.params.id);

    const concept = await prisma.concept.findUnique({ where: { id } });
    await prisma.concept.delete({ where: { id } });

    await redis.del(conceptCacheListKey(concept.studyListId));
    await redis.del(conceptCacheKey(id));

    reply.send();
}

module.exports = { register, update, list, get, remove }