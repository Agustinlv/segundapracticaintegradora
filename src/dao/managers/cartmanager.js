import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

export default class CartManager{

    async createCart(uid){
        
        try {
            
            let cart = await cartModel.findOne({owner: uid, status: true});

            if (!cart) {
                
                await cartModel.create({owner: uid}).then(result => cart = result);

            };

            return {
                code: 202,
                status: 'Success',
                message: cart
            };

        } catch (error) {

            return {
                code: 400,
                status: 'Error',
                message: error
            };

        };

    };

    //Trae los datos del cart
    async getCart(cid){

        const cart = await cartModel.findById(cid).populate({path:'products.product'}).lean();

        if(!cart){
            return {
                code: 400,
                status: 'Error',
                message: 'No se ha encontrado un cart con ese ID'
            };
        };

        return {
            code: 202,
            status: 'Success',
            message: cart
        };

    };

    async updateCart(cid, pid, action){

        //Chequeo que existan tanto el producto como el cart
        const product = await productModel.findById(pid);
        
        const cart = await cartModel.findById(cid);

        if (action !== 'empty' && (!cart || !product)) {
            
            return {
                code: 404,
                status: 'Error',
                message: `O el cart ${cid} o el producto ${pid} no existen`
            };

        };

        const productIndex = cart.products.findIndex(object => String(object.product) === pid);
        
        switch (action) {

            case 'delete':
                
                if (productIndex === -1){

                    return;

                } else {
                    
                    cart.products.splice(productIndex, 1);

                };

            break;

            case 'add':

                if (productIndex === -1){

                    cart.products.push({product: pid, quantity: 1});

                } else {

                    cart.products[productIndex].quantity++;

                };

            break;

            case 'empty':

                cart.products.splice(0);
 
            break;

        };
        
        try {

            await cartModel.findByIdAndUpdate(cid, {products: cart.products});

        } catch (error) {

            return {
                code: 400,
                status: 'Error',
                message: `${error}`
            };

        };

        return{
            code: 202,
            status: 'Success',
            message: `El cart con ID ${cid} ha sido actualizado exitosamente`
        };

    };

    //Reemplaza el contenido del cart con un array de productos que viene del req.body
    async replaceCart(cid, _products){

        const cart = await cartModel.findById(cid);

        if (!cart) {
            return{
                code: 403,
                status: 'Error',
                message: `No existe cart con id ${cid}`
            };
        };
        
        try {

            await cartModel.findByIdAndUpdate(cid, {products: _products});

        } catch (error) {

            return {
                code: 400,
                status: 'Error',
                message: `${error}`
            };

        };

        return{
            code: 202,
            status: 'Success',
            message: `El cart con ID ${cid} ha sido actualizado exitosamente`
        };

    };

    //Asigna un quantity arbitrario que viene del req.body
    async changeQuantity(cid, pid, quantity){

        const cart = await cartModel.findById(cid);

        const product = await productModel.findById(pid);

        if (!cart || !product) {
            return{
                code: 403,
                status: 'Error',
                message: `O el cart ${cid} o el producto ${pid} no existen`
            };
        };

        const productToUpdate = cart.products.findIndex(product => String(product.product) === pid);

        if (productToUpdate === -1){
            return{
                code: 403,
                status: 'Error',
                message: `El producto ${pid} no existen en el carrito`
            };
        };

        cart.products[productToUpdate].quantity = quantity

        try {

            await cartModel.findByIdAndUpdate(cid, {products: cart.products});

        } catch (error) {

            return {
                code: 400,
                status: 'Error',
                message: `${error}`
            };

        }

        return{
            code: 202,
            status: 'Success',
            message: `El cart con ID ${cid} ha sido actualizado exitosamente`
        };

    };

};