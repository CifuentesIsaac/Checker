const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    Employee_ID: {type: Number, required: true},
    Role: {type: Number, required: true},
    Department: {type: Number, required: true},
    Name: {type: String, required: true},
    LastName: {type: String, required: true},
    Password: {type: String, required: true},
    Mail: {type: String, required: true},
    Active: {type: Boolean, required: true},
    ItsNew: {type: Boolean, required: true},
},
    {
        versionKey: false
    }
);

module.exports = mongoose.model('user', userSchema);