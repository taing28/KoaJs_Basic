const productRepository = require('../../database/productRepository')

async function generateProducts(ctx) {
    try {
        const { amount } = ctx.request.body;
        console.log('Body:', ctx.request.body);
        console.log('Amount:', amount);


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
        return ctx.body = {
            success: false,
            message: e.message
        }
    }
}

async function getProducts(ctx) {
    try {
        const { limit, sort } = ctx.query;
        const products = productRepository.getAll(limit, sort);
        ctx.status = 200;
        return ctx.body = {
            success: true,
            data: products,
            message: 'Get all products successfully'
        }
    } catch (e) {
        return ctx.body = {
            success: false,
            error: e.message
        }
    }
}

async function getProduct(ctx) {
    try {
        const { id } = ctx.params;
        const product = productRepository.getOne(id);
        if (!product) {
            throw new Error('Product not found')
        }
        const { field } = ctx.query;
        ctx.status = 200;
        if (field) {
            const fields = field.split(',');
            const response = fields.reduce((acc, curr) => {
                acc[curr] = product[curr] || null;
                return acc;
            }, {})

            return ctx.body = {
                success: true,
                data: response,
                message: 'Get product successfully'
            }
        }

        return ctx.body = {
            success: true,
            data: product,
            message: 'Get product successfully'
        }
    } catch (error) {
        return ctx.body = {
            success: false,
            error: error.message
        }

    }
}

async function addProduct(ctx) {
    try {
        const productData = ctx.request.body;
        if (productRepository.isExists(productData.id)) {
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
        return ctx.body = {
            success: false,
            error: error.message
        }

    }
}

async function updateProduct(ctx) {
    try {
        const { id } = ctx.params;
        if (!productRepository.isExists(id)) {
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
        return ctx.body = {
            success: false,
            error: e.message
        }
    }
}

async function removeProduct(ctx) {
    try {
        const { id } = ctx.params;
        if (!productRepository.isExists(id)) {
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