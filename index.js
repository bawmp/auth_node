const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');

//Configuration les fichiers dotenv en utilisant une autre bibliothèque et d'autres fichiers
dotenv.config({path:'./config/config.env'}); 
require('./config/conn');
//Création d'une application à partir d'Express
const app = express();
const route = require('./routes/userRoute');

//Utilisation d'express.json pour obtenir une requête de données au format JSON
app.use(cookieParser());
app.use(express.json());

//Utilisation des routes avec Express
app.use('/api', route);

//Écoute du serveur avec Express
app.listen(process.env.PORT,()=>{
    console.log(`Server is listening at ${process.env.PORT}`);
})

