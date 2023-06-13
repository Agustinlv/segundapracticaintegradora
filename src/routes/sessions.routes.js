//Module imports
import { Router } from "express";
import jwt from 'jsonwebtoken';

const router = Router();

//File imports
import userModel from "../dao/models/user.models.js";
import CartManager from "../dao/managers/cartmanager.js";
import { authToken, createHash, generateToken, validatePassword } from '../utils.js';
import passport from "passport";

const cartManager = new CartManager();


router.post('/register', async (req, res) => {
    
    const { first_name, last_name, email, age, password } = req.body;

    const inUse = await userModel.findOne({email: email});

    if (inUse) return res.status(400).send({status: 'Error', message: 'The email is already in use'});

    const user = { first_name, last_name, email, age, password: createHash(password) };

    try {

        await userModel.create(user);

        return res.status(202).send({status: 'Success', message: 'User registered'});

    } catch (err) {

        return res.status(400).send({status: "Error", message: err});

    };

});

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({email: email});

    if (!user) return res.status(400).send({status: 'Error', message: 'Incorrect username or password'});

    const isValidPassword = validatePassword(password, user);

    if (!isValidPassword) return res.status(400).send({status: 'Error', message: 'Incorrect username or password'});

    //Cuando se loguea, intento crear un cart y asignar al usuario como dueño. Si encuentra un cart abierto (status: true), devuelve un cart ya existente para ese usuario. Si no encuentra un cart a su nombre o el cart está cerrado (status: false), crea uno y devuelve el objeto cart para que siga comprando con ese. Ver createCart en el cartmanager.js
    await cartManager.createCart(user.id);

    req.user = await userModel.findOne({email: email});;

    const access_token = generateToken(user);

    res.cookie('token', access_token, {httpOnly: true}).send({status: 'Success', message: 'Correct login'});

});

router.get('/logout', (req, res) => {

    res.clearCookie('token');

    res.redirect('/login');

});

router.get('/current', passport.authenticate('current', {session: false, failureRedirect: '/login'}), (req, res) => {

    res.send(req.user.user);

});

export default router;