const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, 'Name must be at least 3 characters long'],
      required: [true, 'Both fields must be filled'],
    },
    number: {
      type: String,
      required: [true, 'Both fields must be filled'],
      minLength: [8, 'Number must be at least 8 characters long'],
      
    },
})
let validator = v => {
  return /^\d{2,3}-\d+$/.test(v)
}

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
personSchema.path('number').validate(validator, "Invalid format for number")


/*
validation: {
        validator: function(v) {
          console.log(v)
          return /\d{2,3}-\d+/.test(v)
        },
        message: props => `${props.value} is not a valid phone number!`
      },*/
module.exports = mongoose.model('Person', personSchema)