const productRepository = require('../../database/productRepository')

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: null, message: string}|{success: boolean, message: string}>}
 */
async function generateProducts(ctx) {
    try {
        const { amount } = ctx.request.body;
        if (!amount || amount < 0) {
            throw new Error("Please enter amount of products")
        }
        productRepository.generateProducts(amount)
        ctx.status = 201;
        return ctx.body = {
            success: true,
            data: null,
            message: 'Products generated successfully'
        }
    } catch (e) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            message: e.message
        }
    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: [{id: number, name: string, price: number, description: string, product: string, color: string, createdAt: string, image: string}], message: string}|{success: boolean, message: string}>}
 */
async function getProducts(ctx) {
    try {
        const { limit, sort } = ctx.query;
        const products = productRepository.findAllByFilter(limit, sort);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: products,
            message: 'Get all products successfully'
        }
    } catch (e) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: e.message
        }
    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: {id: number, name: string, price: number, description: string, product: string, color: string, createdAt: string, image: string}, message: string}|{success: boolean, message: string}>}
 */
async function getProduct(ctx) {
    try {
        const { id } = ctx.params;
        if (!productRepository.isExisted(id)) {
            throw new Error('Product not found');
        }
        const { field } = ctx.query;
        const product = productRepository.getOne(id, field);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: product,
            message: 'Get product successfully'
        }
    } catch (error) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: error.message
        }

    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: {id: number, name: string, price: number, description: string, product: string, color: string, createdAt: string, image: string}, message: string}|{success: boolean, message: string}>}
 */
async function addProduct(ctx) {
    try {
        const productData = ctx.request.body;
        if (productRepository.isExisted(productData.id)) {
            throw new Error('Product id already exists');
        }
        const newProduct = productRepository.add(productData);
        ctx.status = 201;
        return ctx.body = {
            success: true,
            data: newProduct,
            message: 'Create product successfully'
        }
    } catch (error) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: error.message
        }

    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: {id: number, name: string, price: number, description: string, product: string, color: string, createdAt: string, image: string}, message: string}|{success: boolean, message: string}>}
 */
async function updateProduct(ctx) {
    try {
        const { id } = ctx.params;
        if (!productRepository.isExisted(id)) {
            ctx.status = 404;
            throw new Error('Product not found');
        }
        const newProductData = ctx.request.body;
        const updatedProduct = productRepository.update(id, newProductData);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: updatedProduct,
            message: 'Update product successfully'
        }
    } catch (e) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: e.message
        }
    }
}

/**
 * 
 * @param ctx 
 * @returns {Promise<{success: boolean, data: null, message: string}|{success: boolean, message: string}>}
 */
async function removeProduct(ctx) {
    try {
        const { id } = ctx.params;
        if (!productRepository.isExisted(id)) {
            throw new Error('Product not found');
        }
        productRepository.remove(id);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: null,
            message: 'Remove product successfully'
        }
    } catch (e) {
        ctx.status = 400;
        return ctx.body = {
            success: false,
            error: e.message
        }
    }
}

module.exports = {
    generateProducts,
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    removeProduct
}