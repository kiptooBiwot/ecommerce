const { createProduct, getAllProducts } = require('../controllers/Product.controllers')
const upload = require('../helpers/multer.helper')

const router = require('express').Router()

router.get('/', getAllProducts)

// Upload multiple images using: upload.array('image')
router.post('/', upload.array('image', 12), createProduct)

module.exports = router