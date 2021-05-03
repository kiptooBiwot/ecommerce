const Product = require('../models/Product.model')
const createError = require('http-errors')
const cloudinary = require("../helpers/cloudinary.helper")
const { default: slugify } = require('slugify')
// const multer = require('../helpers/multer.helper')

module.exports = {
  getAllProducts: async (req, res, next) => {
    try {
      res.json('Product route')
    } catch (error) {
      next(error)
    }
  },

  createProduct: async (req, res, next) => {
    try {
      if (req.files) {
        const imageURIs = []
        const files = req.files

        // Loop through and get the image 'paths'
        for (const file of files) {
          // destructure the path from the file object
          const { path } = file
          // Upload the image to Cloudinary
          const newPath = await cloudinary.uploader.upload(path)
          // console.log(newPath)
          // add the result to the array
          imageURIs.push({img: newPath.secure_url})
        }
        // console.log(`Image URIs: ${imageURIs}`)

        const { name, price, description, productPicture, quantity, category } = req.body

        const product = new Product({
          name,
          slug: slugify(name),
          price,
          quantity,
          description,
          productPicture,
          category,
          createdBy: req.user.id
        })

        product.productPicture = imageURIs

        const savedProduct = await product.save()

        console.log(savedProduct)

        if (savedProduct) {
          res.json(savedProduct)
        }
      } else {
        next(createError('No image file selected'))
      }
      // upload image file to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path)
      // console.log((await result).secure_url)
      // console.log((await result).public_id)
      // res.send(imageURIs)
    } catch (error) {
      next(error)
    }
  }
}