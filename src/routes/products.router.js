//Module imports
import { Router } from 'express';

const router = Router();

//File imports
import ProductManager from '../dao/managers/productmanager.js';

const productManager = new ProductManager();

router.get('/', async (req, res)=>{

    const {limit = 10, page = 1, category, available, sort} = req.query;
    
    const respuesta = await productManager.getProducts(limit, page, category, available, sort);

    res.status(respuesta.code).send({
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
    });

});

router.get('/:pid', async (req, res)=>{
    
    const pid = req.params.pid;

    const respuesta = await productManager.getProductByID(pid);

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

});

router.post('/', async (req, res)=>{
    
    const product = req.body;

    const respuesta = await productManager.addProduct(product);

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

});

router.put('/:pid', async (req, res)=>{
    
    const pid = req.params.pid;
    
    const product = req.body;

    const respuesta = await productManager.updateProduct(pid, product);

    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

});

router.delete('/:pid', async (request, response)=>{
    
    const pid = request.params.pid;

    const respuesta = await productManager.deleteProduct(pid);

    response.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });

});

export default router;