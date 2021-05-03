const { createProduct, getAllProducts } = require('../controllers/Product.controllers')
const { isAdmin, verifyAccessToken } = require('../helpers/jwt.helpers')
const upload = require('../helpers/multer.helper')


const router = require('express').Router()

router.get('/', getAllProducts)

// Upload multiple images using: upload.array('image')
router.post('/', verifyAccessToken, isAdmin, upload.array('image', 12), createProduct)

module.exports = router