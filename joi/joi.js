const Joi = require('@hapi/joi');

module.exports.validateInput = (reqBody) =>
{
    const schema = {
        username: Joi.string().alphanum().min(3).required(),
        email:Joi.string().email({ minDomainSegments: 2}),
        password: Joi.string().min(7)
    }

    return Joi.validate(reqBody, schema);
}

module.exports.validateTask = (reqBody) =>{

    const schema = {
        description: Joi.string().min(3).required(), 
    }

    return Joi.validate(reqBody, schema);
}