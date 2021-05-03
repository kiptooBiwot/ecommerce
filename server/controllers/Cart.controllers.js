const createError = require('http-errors')
const Cart = require('../models/Cart.model')

module.exports = {
  getCartItems: async (req, res, next) => {
    try {
        
    } catch (error) {
      next(error)
    }
  },

  addItemToCart: async (req, res, next) => {
    try {
      // Check if user exists in the cart document
      const cartExists = await Cart.findOne({ user: req.user.id })

      
      if (cartExists) {
        // If user's cart exists increase the quantity of the product if it's not a new product
        const product = req.body.cartItems.product
        const item = cartExists.cartItems.find(c => c.product == product)

        if (item) {
          const updatedCart = await Cart.findOneAndUpdate({ "user": req.user.id, "cartItems.product": product }, {
            "$set": {
              "cartItems.$": {
                ...req.body.cartItems,
                quantity: item.quantity + req.body.cartItems.quantity
              }
            }
          }, { new: true })

          res.status(201).json(updatedCart)

        } else {
          const updatedCart = await Cart.findOneAndUpdate({ user: req.user.id }, {
            "$push": {
              "cartItems": [req.body.cartItems]
            }
          }, { new: true })
  
          res.status(201).json({updatedCart})
        }
      } else {
        // if no user's cart, create a new cart
        const cartItem = new Cart({
          user: req.user.id,
          cartItems: req.body.cartItems
        })
  
        const cart = await cartItem.save()
        
        res.status(201).json(cart)
      }
      
    } catch (error) {
      next(error)
    }
  }
}