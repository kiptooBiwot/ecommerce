const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    offer: {
        type: Number,
        trim: true
    },
    productPicture: [
        { img: { type: String } }
    ],
    category: {
        type: Schema.Types.ObjectId,
        required: true
    },
    reviews: [
        {
            userId: { type: Schema.Types.ObjectId },
            review: { type: String }
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId
    }
}, { timestamps: true })

module.exports = model('Product', productSchema)