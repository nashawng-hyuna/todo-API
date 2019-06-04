const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   username:{type:String, required:true},
   email:{type:String, required:true},
   password:{type:String, required:true},
   task:[{ type: mongoose.Schema.Types.ObjectId, ref:'task'}]
   
});

const model = mongoose.model('user', userSchema);

module.exports = model;