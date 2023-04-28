const express = require('express');
const multer = require('multer');                                                   //takes care of image upload (upload.single) and also parse the data in the req.body

const productsIndexTemplate = require('../../views/admin/products/index');
const { handleError, requireAuth } = require('./middlewares')
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', requireAuth, upload.single('image'), [requireTitle, requirePrice], handleError(productsNewTemplate), async (req, res) => {

    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });
    res.redirect('/admin/products');
});

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
    const product = await productsRepo.getOne(req.params.id);
    if (!product) {
        res.send('product Not Found')
    }
    res.send(productEditTemplate({ product }))
})

router.post('/admin/products/:id/edit',
    requireAuth,
    upload.single('image'),
    [requireTitle, requirePrice],
    handleError(productEditTemplate, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        }
        console.log(changes.id)
        await productsRepo.update(req.params.id, changes);

        res.redirect('/admin/products')

    }
);

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
    await productsRepo.delete(req.params.id);

    res.redirect('/admin/products')
});
module.exports = router;