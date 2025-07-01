const fs = require('fs');
const { data: products } = require('./products.json');
const { faker } = require('@faker-js/faker');
const Helper = require('../libs/Helper');

/**
 * 
 * @param {number} amount 
 */
function generateProducts(amount) {
    const updatedProducts = []
    for (let i = 1; i <= amount; i++) {
        updatedProducts.push({
            id: i,
            name: faker.commerce.productName(),
            price: faker.commerce.price({ min: 1, max: 10000 }),
            description: faker.commerce.productDescription(),
            product: faker.commerce.productAdjective(),
            color: faker.color.human(),
            createdAt: faker.date.past(),
            image: faker.image.url()
        })
    }

    fs.writeFileSync('./src/database/products.json', JSON.stringify({
        data: updatedProducts
    }))
}

/**
 * 
 * @param {number} limit 
 * @param {string} sort 
 * @returns {[{id: number, name: string, price: number, description: string, product: string, color: string, createdAt: string, image: string}]}
 */
function findAllByFilter(limit, sort) {
    let filteredProducts = [...products];
    if (sort) {
        filteredProducts.sort((prev, next) => {
            if (sort === 'asc') {
                return new Date(prev.createdAt) - new Date(next.createdAt);
            }
            if (sort === 'desc') {
                return new Date(next.createdAt) - new Date(prev.createdAt);
            }
        })
    }
    if (limit) {
        filteredProducts = filteredProducts.reduce((acc, p, i) => {
            if (i < limit) {
                acc.push(p);
            }
            return acc;
        }, []);
    }
    return filteredProducts;
}

/**
 * 
 * @param {number} id 
 * @param {string[]} fields 
 * @returns {{id: number, name: string, price: number, description: string, product: string, color: string, createdAt: string, image: string}}
 */
function getOne(id, fields) {
    let product = products.find(p => p.id == id);
    if (fields) {
        const fieldsData = fields.split(',');
        const productObj =  Helper.pick(product, fieldsData);
        return productObj;
    }
    return product;
}

/**
 * 
 * @param {{ name: string, price: number, description: string, product: string, color: string, image: string }} data 
 * @returns {{id: number, name: string, price: number, description: string, product: string, color: string, createdAt: string, image: string}}
 */
function add(data) {
    // the less mutation, the better.
    const updateProducts = [...products, {...data, createdAt: new Date()}];
    fs.writeFileSync('./src/database/products.json', JSON.stringify({
        data: updateProducts
    }))
    return data;
}

/**
 * 
 * @param {number} id 
 * @param {{ name: string, price: number, description: string, product: string, color: string, image: string }} data 
 * @returns {{ name: string, price: number, description: string, product: string, color: string, image: string }}
 */
function update(id, data) {
    const updateProducts = products.map(p => {
        if (p.id == id) {
            return {
                ...p,
                ...data
            }
        }
        return p;
    })

    fs.writeFileSync('./src/database/products.json', JSON.stringify({
        data: updateProducts
    }))
    return data;
}

/**
 * 
 * @param {number} id 
 */
function remove(id) {
    const updateProducts = products.filter(p => p.id != id);
    fs.writeFileSync('./src/database/products.json', JSON.stringify({
        data: updateProducts
    }))
}

/**
 * 
 * @param {number} id 
 * @returns true | false
 */
function isExisted(id) {
    return products.some(p => p.id == id);
}

module.exports = {
    generateProducts,
    findAllByFilter,
    getOne,
    add,
    update,
    remove,
    isExisted
}