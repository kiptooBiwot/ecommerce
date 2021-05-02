const { diskStorage } = require('multer')
const multer = require('multer')
const path = require('path')
const createError = require('http-errors')

module.exports = multer({
    storage: diskStorage({
        filename: (req, file, next) => {
            next(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    fileFilter: (req, file, next) => {
        if (!file) throw createError('Please choose an image file')

        // Allowable file extensions
        const fileTypes = /jpg|jpeg|png|gif/

        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        )

        const mimetype = fileTypes.test(file.mimetype)

        if (mimetype && extname) {
            return next(null, true)
        } else {
            return next(createError('Error: Error uploading file. File type not supported'))
        }
    }
})