import productModel from '../models/product.model.js';

export default class ProductManager{

    async addProduct(_product){
        
        if (!this.validateProduct(_product)){
            return {
                code: 400,
                status: 'Error',
                message: 'Faltan uno o más campos. Por favor, verifique que el objeto a insertar tenga todos los campos obligatorios, etc.'
            };
        };
        
        const products = await productModel.find();

        //Chequeo que el código asignado manualmente no se repita con alguno que ya pertenezca a un producto existente        
        const codeFound = products.find(product => product.code === _product.code);

        if (codeFound){
            return {
                code: 403,
                status: 'Error',
                message: `No se pudo agregar el nuevo producto porque el código ${_product.code} ya está en uso`
            };
        };

        //Finalmente creo el producto en la base de datos
        try {
            
            await productModel.create(_product);

        } catch (error) {
            
            return {
                code: 400,
                status: 'Error',
                message: `${error}`
            };

        };

        return {
            code: 202,
            status: 'Success',
            message: `El producto ${_product.title} ha sido agregado con éxito.`
        };

    };

    async getProducts(limit, page, category, available, sort){

        let query = {};

        if (category) {
            if (available) {
                query = {category: category, stock: { $gt: 0}}
            } else {
                query = {category: category}
            }
        };
        
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await productModel.paginate(
            query,
            {
                limit: limit,
                sort:{ price: sort },
                page: page,
                lean: true
            }
        );

        const payload = docs;
        
        const prevLink = hasPrevPage === false ? null : `/products?page=${prevPage}`;

        const nextLink = hasNextPage === false ? null : `/products?page=${nextPage}`;

        return {
            code: 202,
            status: 'Success',
            message: {
                payload,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasNextPage,
                hasPrevPage,
                prevLink,
                nextLink
            }
        };
    };

    async getProductByID(pid){
        
        const product = await productModel.findById(pid);

        if(!product){
            
            return {
                code: 400,
                status: 'Error',
                message: 'No se han encontrado productos con ese ID'
            };

        };

        return {
            code: 202,
            status: 'Success',
            message: product
        };
    };

    async updateProduct(pid, _product){
        
        if (!this.validateProduct(_product)){
            
            return {
                code: 400,
                status: 'Error',
                message: 'Faltan uno o más campos. Por favor, verifique que el objeto a insertar tenga todos los campos obligatorios, etc.'
            };

        };

        const products = await productModel.find();

        //Chequeo que el código de producto no le pertenezca a otro producto.
        const codeFound = products.filter(product => product.id !== pid).find(product => product.code === _product.code);

        if(codeFound){

            return {
                code: 403,
                status: 'Error',
                message: `El código de producto que del producto que intenta actualizar ya pertenece al producto con ID ${codeFound.id}`
            };
            
        };

        const product = await productModel.findById(pid);

        if (!product){
            return{
                code: 404,
                status: 'Error',
                message: `No se ha encontrado un producto con el id ${pid}`
            }
        };
        
        try {
            
            await productModel.findByIdAndUpdate(pid, _product);

        } catch(error) {
            
            return {
                code: 403,
                status: 'Error',
                message: `${error}`
            };
 
        };

        return {
            code: 202,
            status: 'Success',
            message: `El producto ${pid} ha sido actualizado con éxito`
        };
        
    };

    async deleteProduct(pid){
        
        try {

            await productModel.findByIdAndDelete(pid)

        } catch(error) {

            return {
                code: 400,
                status: 'Error',
                message: `${error}`
            };

        }
    
        return{
            code: 202,
            status: 'Success',
            message: `El producto con ID ${pid} ha sido elminado exitosamente`
        };
    
    };

    validateProduct(_product){

        if (Object.keys(_product).length === 0){
            return false;
        }

        if (!_product.title || !_product.description || !_product.code || !_product.price || !_product.status || !_product.stock || !_product.category){
            return false;
        };

        return true;
    };
};