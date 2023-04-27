const express = require('express');
const multer = require('multer');                                                   //takes care of image upload (upload.single) and also parse the data in the req.body

const productsIndexTemplate = require('../../views/admin/products/index');
const { handleError } = require('./middlewares')
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
router.get('/admin/products', async (req, res) => {
    const products = await productsRepo.getAll();
    productsIndexTemplate({ products });
});

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', upload.single('image'), [requireTitle, requirePrice], handleError(productsNewTemplate), async (req, res) => {

    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });
    res.send('Submitted');
});

module.exports = router;