const generateQuestion = require("../lib/generator-questions");
const prisma = require("../lib/prisma");

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function quiz(request, reply) {
    const studyList = await prisma.studyList.findUnique({
        where: {
            id: Number(request.params.studyListId)
        },
        select: {
            title: true,
            concept: true
        }
    });

    const questions = [];

    studyList.concept.forEach(concept => {
        questions.push(generateQuestion(studyList.title, concept.title, concept.description));
    });

    reply.send(await Promise.all(questions));
}

module.exports = { quiz };