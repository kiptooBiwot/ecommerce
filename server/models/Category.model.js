const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    categoryImage: {
        type: String
    },
    parentId: {
        type: String
    }
}, { timestamps: true })

module.exports = model('Category', CategorySchema)