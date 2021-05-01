const { createCategory, getAllCategories } = require('../controllers/Category.controllers')

const router = require('express').Router()

router.get('/', getAllCategories)

router.post('/create', createCategory)

module.exports = router