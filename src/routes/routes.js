const Router = require('koa-router');
const bookHandler = require('../handlers/books/bookHandlers');
const productHandler = require('../handlers/products/productHandlers')
const bookInputMiddleware = require('../middlewares/bookInputMiddleware');
const productInputMiddleware = require('../middlewares/productInputMiddleware')

// Prefix all routes with /books
const router = new Router({
  prefix: '/api'
});

// Routes will go here
router.get('/books', bookHandler.getBooks);
router.get('/books/:id', bookHandler.getBook);
router.post('/books', bookInputMiddleware, bookHandler.save);

router.get('/products', productHandler.getProducts);
router.get('/products/:id', productHandler.getProduct);
router.post('/products/generate', productHandler.generateProducts);
router.post('/products', productInputMiddleware.inputCreate, productHandler.addProduct);
router.put('/products/:id', productInputMiddleware.inputUpdate, productHandler.updateProduct);
router.delete('/products/:id', productHandler.removeProduct);

module.exports = router;
