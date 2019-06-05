const express = require('express');
const joi = require('../joi/joi');
const task = require('../models/task-model');
const boom = require('@hapi/boom');
const user = require('../models/user-model');
const jsontoken = require('../jwt/jwt');


const task_router = express.Router();

/*CRUD OPERATIONS DONE BELOW*/

task_router.get('/create', jsontoken.verify, (req, res) =>{
     
     const {uid} = req.query
     return res.status(200).render('add.handlebars', {uid});
});

/*1. Display tasks  for  user with given id */
task_router.get('/display/:id', jsontoken.verify,  async (req, res, next) =>{

     const {id} = req.params;

     let message = req.flash('success');

     try{
          let person = await user.findOne({_id:id})
          .populate({path:'task', select: ' _id description createdOn completed completedOn'});

           return res.status(200).render('index.handlebars', {user:person, task:person.task, message});
           
         // return res.status(200).send(person.task);
     }
     catch(error)
     {
         next(error);
     }
});

/*2. Add a new task for user with given id*/
task_router.post('/add', jsontoken.verify, async (req, res, next) =>{

   const {id, description} = req.body;

   const {error} = joi.validateTask({description});

    //no error found
    if(!error)
    {
         try
         {
             //find user
             let result = await user.findOne({_id:id});

             if(result) //user found
             {
               //create and save task
               let newTask = new task({description});

               let newTodo = await newTask.save();
     
               //get task id & add to array in user model
               const {_id} = newTodo;
               result.task.push(_id);
              
               //update user model 
               let updateUser = await user.updateOne({_id:id}, {$set:{task:result.task}});

               return res.status(301).redirect(`/api/task/display/${id}`);

               /*return res.status(200).json({
                    message:"Task added"  
               }); */      
             }  
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

/*3. update a task with a given*/
task_router.patch('/update/:task_id', jsontoken.verify, async (req, res, next) =>{

   
     const {task_id} = req.params;
     const {id} = req.body;

     try{
         //find and update task
        let item = await task.updateOne({_id:task_id}, {$set:{"completed":true, "completedOn": Date()}});
         return res.status(301).redirect(`/api/task/display/${id}`);

        // return res.status(200).send(item);
     }
     catch(error)
     {
          next(error);
     }   
});

/*4. update a task with a given*/
task_router.delete('/remove/:task_id', jsontoken.verify, async (req, res, next) =>{

     const {task_id} = req.params;
     const {id} = req.body;

     try{ 
          let item = await task.deleteOne({_id:task_id});

          return res.status(301).redirect(`/api/task/display/${id}`);

         // return res.status(204).send(item);
     }
     catch(error)
     {
          next(error);
     }
});

module.exports = task_router;