const util = require('util');
const jwt = require('jsonwebtoken');

const jwt_sign = util.promisify(jwt.sign);
const jwt_verify = util.promisify(jwt.verify);

module.exports.sign = async (payload) =>{

    try{
        return await jwt_sign(payload, 'secret', {expiresIn: 30});
    }
    catch(error)
    {
         next(error);
    }  
}

module.exports.verify = async (req, res, next) =>{

    try{

            let token = req.headers.authorization.split(' ')[1];
            let result = await jwt_verify(token, 'secret');
            next();    
    }
    catch(error)
    {
        next(error);
    }
}