const { hashSync, compareSync } = require('bcryptjs');
const { generate, verify } = require('../lib/jwt-token');
const prisma = require('../lib/prisma');

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function register(request, reply) {
    const { email, name, password } = request.body;

    if ((await prisma.client.findUnique({ where: { email } })) !== null) {
        reply.status(400).send({ error: 'Email registrado' })
        return;
    }

    const client = await prisma.client.create({
        data: {
            email: email,
            name: name,
            password: hashSync(password)
        }
    });

    const token = generate(client.id.toString());

    reply.send({ token });
}

/**
 * @param {import("fastify").FastifyRequest} request 
 * @param {import("fastify").FastifyReply} reply 
 */
async function access(request, reply) {
    const { email, password } = request.body;

    const client = await prisma.client.findUnique({ where: { email } });

    if (client === null) {
        reply.status(400).send({ error: 'Email não registrado' })
        return;
    }

    if (!compareSync(password, client.password)) {
        reply.status(401).send({ error: 'Senha incorreta' })
        return;
    }

    const token = generate(client.id.toString());

    reply.send({ token });
}

module.exports = { register, access };