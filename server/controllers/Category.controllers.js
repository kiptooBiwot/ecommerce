const createError = require('http-errors')
const Category = require('../models/Category.model')
const slugify = require('slugify')
const Cloudinary = require('../helpers/cloudinary.helper')

const getNestedCategories = (categories, parentId = null) => {
  const categoryList = []
  let category
  if (parentId == null) {
    // Filter the categories with no parentId
    category = categories.filter(cat => cat.parentId == undefined)
  } else {
    // Filter the categories with a parentID (child categories)
    category = categories.filter(cat => cat.parentId == parentId)
  }

  // Loop throgh all the categories and run get the nested categories
  for (let categ of category) {
    categoryList.push({
      _id: categ._id,
      name: categ.name,
      slug: categ.slug,
      children: getNestedCategories(categories, categ._id)
    })
  }

  console.log(categoryList)

  return categoryList
}

module.exports = {
  getAllCategories: async (req, res, next) => {
    try {
      Category.find({})
        .exec((error, categories) => {
          if (error) throw createError(error)

          if (categories) {
            // console.log(`Cats before FN: ${categories}`)
            const categoryList = getNestedCategories(categories)
            res.json({
              categoryList
            })
          }
        })
    } catch (error) {
      next(error)
    }
  },
  createCategory: async (req, res, next) => {
    try {
      // upload category image if any
      let categoryImageURI
      if (req.file) {
        const result = await  Cloudinary.uploader.upload(req.file.path)
        categoryImageURI = result.secure_url
      }

      const categoryObject = {
        name: req.body.name,
        categoryImage: categoryImageURI,
        slug: slugify(req.body.name)  
      }

      if (req.body.parentId) {
        categoryObject.parentId = req.body.parentId
      }

      const newCategory = new Category(categoryObject)

      // Save category
      const savedCategory = await newCategory.save()

      res.status(201).json({
        message: 'Category saved',
        category: savedCategory
      })

    } catch (error) {
      if (error.code === 11000) throw next(createError.Conflict('Category is already created!'))
      next(error);
    }
  }
}