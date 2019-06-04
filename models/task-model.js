const mongoose = require('mongoose');

const taskSchema  = new mongoose.Schema({
    description:{type:String, required:true},

    completed:{type:Boolean, default: false},

    createdOn:{type:Date, default: Date.now},
    
    completedOn:{type:Date}
});

const model = mongoose.model('task', taskSchema);

module.exports = model;