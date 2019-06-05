const util = require('util');
const jwt = require('jsonwebtoken');

const jwt_sign = util.promisify(jwt.sign);
const jwt_verify = util.promisify(jwt.verify);

module.exports.sign = async (res, payload) =>{

    try{
         //sign token and set cookie
         let token = await jwt_sign(payload, 'secret', {expiresIn: 100});

        return res.cookie('Auth-token', token);

        //return await jwt_sign(payload, 'secret', {expiresIn: 60*60});   
    }
    catch(error)
    {
       res.status(404).send(error);
    }  
}

module.exports.verify = async (req, res, next) =>{

    try{
            
          //let token = req.headers.authorization.split(' ')[1];

            let token = req.cookies['Auth-token'];
           
            let result = await jwt_verify(token, 'secret');

            next();    
    }
    catch(error)
    {
        next(error);
    }
}