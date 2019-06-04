const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const boom = require('@hapi/boom');
const joi = require('../joi/joi');
const jsontoken = require('../jwt/jwt');

const user_router = express.Router();

user_router.post('/signup', async (req, res, next) =>{

    const {error} = joi.validateInput(req.body);

     if(!error) //input is valid
     {
       try{

            //get form input
            const {username, email, password} = req.body;

            //check if user already exists
            let user = await User.findOne({username:username});

             if(user)
             {
                 const {message} = boom.conflict('User already exists').output.payload;
                 return res.status(409).send(message);
              } 

           /*user is not present. add user */

           /*hash user password and save user*/
           let hash = await bcrypt.hash(password, 10);

            let newUser = new User({
                username,
                email,
                password:hash
            });
             
             let result = await newUser.save();

                const payload = {
                   id:result._id,
                   username:result.username
                }

              let token =  await jsontoken.sign(payload);

                return res.status(200).json({
                    id: result._id,
                    username: result.username,
                    token
                });
         }
         catch(error)
         {
             next(error);
         }   
     }

     //error found from input validation
    const {message} = error.details[0];
    return res.status(400).send(boom.badRequest(message).output.payload);
});



user_router.post('/signin', async (req, res, next) =>{
    
    const {error} = joi.validateInput(req.body);

    if(!error)
    {
        const {username, password} = req.body;

        let person = await User.findOne({username:username});

        if(person)
        {
            let result = await bcrypt.compare(password, person.password);


            if(result === true)
            {   
                const payload = {
                    id:result._id,
                    username:result.username
                }
                
                let token =  await jsontoken.sign(payload);

                return res.status(200).json({
                    message:'Login successful',
                    token
                }); 
            }
        }

        return res.status(400).send(boom.badRequest('Username /Password is not valid').output.payload);  
    }

    //error found
    const {message} = error.details[0];
    return res.status(400).send(boom.badRequest(message).output.payload);
});


module.exports = user_router;