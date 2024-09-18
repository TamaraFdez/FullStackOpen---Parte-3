const mongoose = require('mongoose')

require('dotenv').config()

const url = process.env.URI_DB

mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch((err) => {
    console.error('Error al conectar MongoDB:', err)
  })

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    },
    number: {
      type: String,
      required: [true, 'El número es obligatorio'],
      minlength: [8, 'El número debe tener al menos 8 caracteres'],
      validate: {
        validator: function (v) {
          return /^\d{2,3}-\d{5,}$/.test(v)
        },
        message: (props) =>
          `${props.value} no es un número válido, debe seguir el formato 09-1234556 o 040-22334455.`,
      },
    },
  },
  { versionKey: false }
)

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  },
})

module.exports = mongoose.model('Contact', contactSchema)
