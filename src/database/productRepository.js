const fs = require('fs');
const {data: products} = require('./products.json');
const {faker} = require('@faker-js/faker');

function generateProducts(amount) {
    const updatedProducts = []
    for (let i = 1; i <= amount; i++) {
        updatedProducts.push({
            id: i,
            name: faker.commerce.productName(),
            price: faker.commerce.price({min: 1, max: 10000}),
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

function findAllByFilter(limit, sort) {
    let filteredProducts = [...products];
    if(limit) {
        // filteredProducts = filteredProducts.slice(0, limit);
        filteredProducts = filteredProducts.reduce((acc, p, i) => {
            if(i < limit) {
                acc.push(p);
            }
            return acc;
        }, []);
    }
    if(sort) {
        filteredProducts.sort((prev,next) => {
            if(sort === 'asc') {
                return new Date(prev.createdAt) - new Date(next.createdAt);
            }
            if(sort === 'desc') {
                return new Date(next.createdAt) - new Date(prev.createdAt);
            }
        })
    }
    return filteredProducts;
}

function getOne(id) {
    return products.find(p => p.id == id)
}

function add(data) {
    data.createdAt = new Date();
    const updateProducts = [...products, data];
    fs.writeFileSync('./src/database/products.json', JSON.stringify({
        data: updateProducts
    }))
    return data;
}

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

function remove(id) {
    const updateProducts = products.filter(p => p.id != id);
    fs.writeFileSync('./src/database/products.json', JSON.stringify({
        data: updateProducts
    }))
}

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