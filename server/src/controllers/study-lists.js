const prisma = require('../lib/prisma');
const redis = require('../lib/redis');

const studyListCacheListKey = clientId    => `study-list-cache-list-${clientId}`;
const studyListCacheKey     = studyListId => `study-list-cache-${studyListId}`;  

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function register(request, reply) {
    const { clientId, title, description } = request.body;

    await prisma.studyList.create({ data: { clientId, title, description } });

    await redis.del(studyListCacheListKey(clientId));

    reply.send();
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function update(request, reply) {
    const { clientId, title, description } = request.body;

    const id = Number(request.params.id);

    await prisma.studyList.update({
        where: { id },
        data: { title, description }
    });

    await redis.del(studyListCacheListKey(clientId));
    await redis.del(studyListCacheKey(id));

    reply.send();
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function list(request, reply) {
    const listKey = studyListCacheListKey(request.body.clientId);

    const listJson = await redis.get(listKey);

    if(!listJson) {
        const list = await prisma.studyList.findMany({
            where: {
                clientId: request.body.clientId
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

    const studyListKey = studyListCacheKey(id);

    const studyListJson = await redis.get(studyListKey);

    if(!studyListJson) {
        const studyList = await prisma.studyList.findUnique({
            where: { id }
        });

        await redis.set(studyListKey, JSON.stringify(studyList));

        reply.send(studyList);
    }
    else {
        reply.send(JSON.parse(studyListJson));
    }
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function remove(request, reply) {

    const clientId = request.body.clientId;
    const id = Number(request.params.id);

    await prisma.concept.deleteMany({
        where: {studyListId: id}
    });

    await prisma.studyList.delete({ where: { id } });


    await redis.del(studyListCacheListKey(clientId));
    await redis.del(studyListCacheKey(id));
    reply.send();
}

module.exports = { register, update, list, get, remove }