const express = require("express")
const morgan = require("morgan")
const helmet = require('helmet')
const cors = require('cors')
const createError = require("http-errors")
require("dotenv").config()
require("./helpers/mongodb.init")
require('./helpers/redis.init')

const app = express()

const PORT = process.env.PORT || 3000

// Routes
const authRoutes = require('./routes/auth.routes')
const categoryRoutes = require('./routes/category.routes')
const productRoutes = require('./routes/product.routes')
const cartRoutes = require('./routes/cart.routes')

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use(helmet())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
