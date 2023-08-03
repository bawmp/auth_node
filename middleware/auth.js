const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const isAuthenticated = async (req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return next('S\'il-vous-plaît, connectez-vous pour avoir accès aux données');
        }
        const verify = await jwt.verify(token,process.env.SECRET_KEY);
        req.user = await userModel.findById(verify.id);
        next();
    } catch (error) {
       return next(error); 
    }
}

module.exports = isAuthenticated;