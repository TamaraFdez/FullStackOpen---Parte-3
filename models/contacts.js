const mongoose = require('mongoose')

require('dotenv').config();


const url = process.env.URI_DB

mongoose.set('strictQuery',false)

mongoose.connect(url)

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar MongoDB:', err);
  });

// Define el esquema y el modelo
const contactSchema = new mongoose.Schema({
  name: String,
  number: String
},{ versionKey: false });

contactSchema.set('toJSON', {
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Contact', contactSchema);
