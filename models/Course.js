
const {Schema, model} = require('mongoose')  

const courseSchema = new Schema({
  title: String,
  price: Number,
  img: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
})

module.exports = model('Course', courseSchema)