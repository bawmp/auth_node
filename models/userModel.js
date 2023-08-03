const mongoose = require('mongoose');

//Création du schéma en utilisant mongoose
const userSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true,
    },
    phoneNumber: {
        type:Number,
        required:true,
        minLength:9,
        maxLength:12,
        unique: true,
        min:0
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    token:{
        type:String
    }
})

//Creating models
const userModel = mongoose.model('user',userSchema);
module.exports = userModel;