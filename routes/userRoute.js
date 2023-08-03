//Les bibliothèques nécessaire sont importées ici
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../middleware/auth');

//Création d'un routeur express
const route = express.Router();
//Importation du userModel()
const userModel = require('../models/userModel');

//Création de la route pour le register
route.post("/register", async (req, res) => {

    try {
        const { email, phoneNumber, password } = req.body;
        //Vérifier la vacuité des données entrantes
        if (!email || !phoneNumber || !password) {
            return res.json({ message: 'Veuillez entrer toutes les informations' })
        }

        //Vérifier si l'utilisateur existe ou non
        const phoneExist = await userModel.findOne({ phoneNumber: req.body.phoneNumber});
        if (phoneExist) {
            return res.json({ message: 'Un utilisateur possède déjà ce numéro' })
        }
        const emailExist = await userModel.findOne({ email: req.body.email});
        if (emailExist) {
            return res.json({ message: 'Un utilisateur possède déjà cette email' })
        }
        //Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;
        const user = new userModel(req.body);
        await user.save();
        const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        return res.cookie("token", token).json({ success: true, message: 'Enrégistrer avec succès', data: user })
    } catch (error) {
        return res.json({ error: error });
    }

})
//Création de la route pour le login
route.post('/login', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        //Vérifier la vacuité des données entrantes
        if (!phoneNumber) {
            return res.json({ message: 'Veuillez entrer votre numéro de téléphone' })
        }
        //Vérifier si l'utilisateur existe ou non
        const phoneExist = await userModel.findOne({ phoneNumber: req.body.phoneNumber });
        if (!phoneExist) {
            return res.json({ message: 'Veuillez entrer le bon numéro' })
        }
        const token =  jwt.sign({ id: phoneExist._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        
        return res.cookie("token",token).json({ success: true, message: 'Connecté avec succès', token: token })
    } catch (error) {
        return res.json({ error: error });
    }

})

//Créer des routes utilisateur pour récupérer les données des utilisateurs
route.get('/user', isAuthenticated, async (req, res) => {
    try {
        const user = await userModel.find();
        if (!user) {
            return res.json({ message: 'Aucun utilisateur trouvé' })
        }
        return res.json({ user: user })
    } catch (error) {
        return res.json({ error: error });
    }
})
module.exports = route;