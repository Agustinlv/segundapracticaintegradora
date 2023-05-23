//Module imports
import { Router } from "express";

const router = Router();

//File imports
import ProductManager from '../dao/managers/productmanager.js';
import CartManager from "../dao/managers/cartmanager.js";

const productManager = new ProductManager();

const cartManager = new CartManager();

const publicAccess = (req, res, next) => {
    
    if (req.session.user) return res.redirect('/products');

    next();
};

const privateAccess = (req, res, next) => {

    if (!req.session.user) return res.redirect('/login');

    next();
}

router.get('/', privateAccess, async (req, res) => {

    res.redirect('/products')

});

router.get('/login', publicAccess, async(req, res) => {
    
    res.render('login', {});

});

router.get('/register', publicAccess, async (req, res) => {
    
    res.render('register', {})

});

router.get('/profile', privateAccess, async (req, res) => {
    
    res.render('profile', {user: req.session.user})

});

router.get('/carts/:cid', async(req, res) => {
    
    const cid = req.params.cid;

    const respuesta = await cartManager.getCart(cid);

    res.render('cart', {
        status: respuesta.status,
        payload: respuesta.message
    });
    
});

router.get('/products', privateAccess, async (req, res)=>{

    const {limit = 10, page = 1, category, available, sort} = req.query;
    
    const respuesta = await productManager.getProducts(limit, page, category, available, sort);

    res.render('products', {
        status: respuesta.status,
        payload: respuesta.message.payload,
        totalPages: respuesta.message.totalPages,
        prevPage: respuesta.message.prevPage,
        nextPage: respuesta.message.nextPage,
        page: respuesta.message.page,
        hasNextPage: respuesta.message.hasNextPage,
        hasPrevPage: respuesta.message.hasPrevPage,
        prevLink: respuesta.message.prevLink,
        nextLink: respuesta.message.nextLink,
        user: req.session.user
    });

});

export default router;