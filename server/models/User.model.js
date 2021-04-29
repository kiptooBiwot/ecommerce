const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  first_name: {
    type: String,
    trim: true,
    required: true,
    min: 3,
    max: 20
  },
  last_name: {
    type: String,
    trim: true,
    required: true,
    min: 3,
    max: 20
  },
  username: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    index: true,
    lowercase: true
  },
  password: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    emun: ['user', 'admin'],
    default: 'user'
  },
  contact_number: {
    type: String,
    trim: true
  },
  profile_picture: {
    type: String,
    trim: true
  }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  } catch (err) {
    next(err)
  }
})

userSchema.methods.isValidPassword = async function (password) {
  try {
    return bcrypt.compareSync(password, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = model('User', userSchema)