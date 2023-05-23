//Module imports
import { Router } from "express";

const router = Router();

//File imports
import userModel from "../dao/models/user.model.js";
import CartManager from "../dao/managers/cartmanager.js";

const cartManager = new CartManager();


router.post('/register', async (req, res) => {
    
    const { first_name, last_name, email, age, password } = req.body;

    const inUse = await userModel.findOne({email: email});

    if (inUse) {
      
        return res.status(400).send({status: 'Error', message: 'The email is already in use'});
    
    };

    const user = { first_name, last_name, email, age, password };

    try {

        await userModel.create(user);

        return res.status(202).send({status: 'Success', message: 'User registered'});

    } catch (err) {

        return res.status(400).send({status: "Error", message: err});

    };

});

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({email: email, password: password});

    if (!user) {

        return res.status(400).send({status: 'Error', message: 'Incorrect credentials'});

    };

    //Cuando se loguea, intento crear un cart y asignar al usuario como dueño. Si encuentra un cart abierto (status: true), devuelve un cart ya existente para ese usuario. Si no encuentra un cart a su nombre o el cart está cerrado (status: false), crea uno y devuelve el objeto cart para que siga comprando con ese. Ver createCart en el cartmanager.js
    let respuesta = await cartManager.createCart(user.id);

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.email === 'adminCoder@coder.com' ? 'Admin' : 'User',
        cart: respuesta.message._id
    };

    res.send({status: 'Success', message: 'You are now logged in!', payload: req.session.user});

});

router.get('/logout', (req, res) => {

    req.session.destroy(err => {

        if (err) return res.status(500).send({status: 'Error', message: err});

        res.redirect('/login');

    });

})

export default router;