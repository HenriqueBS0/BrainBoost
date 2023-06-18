const {register, access} = require('../controllers/auth');

const objectToken = {
    type: 'object',
    properties: {
        token: {type: 'string'}
    }
};

/**
 * @type {import('fastify').RouteShorthandOptionsWithHandler} 
 */
const optsAccess = {
    schema : {
        response : {
            200: objectToken
        }
    },
    handler: access
}

/**
 * @type {import('fastify').RouteShorthandOptionsWithHandler} 
 */
const optsRegister = {
    schema : {
        response : {
            200: objectToken
        }
    },
    handler: register
}

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").FastifyPluginOptions} options
 * @param {import("fastify").FastifyPluginCallback} done
 */
module.exports = function(fastify, options, done) {
    fastify.post('/access', optsAccess);
    fastify.post('/register', optsRegister);
    done();
}