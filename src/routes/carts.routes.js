import { Router } from 'express';

const router = Router();

//File imports
import CartManager from '../dao/managers/cartmanager.js';

const cartManager = new CartManager();

//Crea un carrito
router.post('/:uid', async(req, res) => {
    
    const uid = req.params.uid;
    
    const respuesta = await cartManager.createCart(uid);

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

});

//Agrega un producto específico a un carrito específico
router.post('/:cid/product/:pid', async (req, res) => {
    
    const cid = req.params.cid;

    const pid = req.params.pid;

    const respuesta = await cartManager.updateCart(cid, pid, "add");

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

});

//Elimina un producto específico de un carrito específico
router.delete('/:cid/product/:pid', async(req, res) => {

    const cid = req.params.cid;

    const pid = req.params.pid;

    const respuesta = await cartManager.updateCart(cid, pid, "delete");

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

});

//Elimina un producto específico de un carrito específico
router.delete('/:cid', async(req, res) => {

    const cid = req.params.cid;

    const respuesta = await cartManager.updateCart(cid, null, "empty");

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

});

//Trae un carrito específico
router.get('/:cid', async(req, res) => {
    
    const cid = req.params.cid;

    const respuesta = await cartManager.getCart(cid);

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
    
});

//Reemplaza el contenido del carrito con un arreglo de productos pasado desde el body
router.put('/:cid', async (req, res) => {

    const cid = req.params.cid;

    const products = req.body;

    const respuesta = await cartManager.replaceCart(cid, products);

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

})

//Modifica la cantidad del producto especificado con la cantidad pasada desde el body
router.put('/:cid/product/:pid', async (req, res) => {

    const cid = req.params.cid;

    const pid = req.params.pid;

    const quantity = req.body.quantity;

    const respuesta = await cartManager.changeQuantity(cid, pid, quantity);

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

})

export default router;