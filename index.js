const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const Contacto = require("./models/contacts");

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)
//GET
/*app.get("/", (resquest, response) => {
  response.send("<h1>Lista telefónica</h1>");
});*/
app.get("/api/persons", (request, response) => {
  Contacto.find({})
    .then((contacts) => {
      response.json(contacts);
    })
    .catch(error => next(error))
});

//Hora y contador
/*app.get("/info", (request, response) => {
  const time = new Date();
  const count = data.length;
  response.send(`
    <p>La agenda tiene información de ${count} personas</p>
    <p>Solicitud recibida a las: ${time}</p>
  `);
});*/

//Get de un solo contacto
app.get("/api/persons/:id", (request, response) => {
  Contacto.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error))
  // const id = Number(request.params.id);
  // const contact = data.find((contact) => contact.id === id);
});

//detele
app.delete("/api/persons/:id", (request, response) => {
  Contacto.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch(error => next(error))
  // const id = Number(request.params.id);
  // data = data.filter((contact) => contact.id !== id);

  // response.status(204).end();
});

//POST

/*const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000000);
  return randomId;
};*/

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "Falta nombre o número." });
  }

  Contacto.findOne({ $or: [{ name }, { number }] })
    .then((existingContact) => {
      if (existingContact) {
        return response
          .status(400)
          .json({
            error: `El contacto con nombre ${name} o número ${number} ya existe.`,
          });
      }

      const newContact = new Contacto({ name, number });

      return newContact.save();
    })
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => {
      console.error("Error al guardar contacto:", error);
      response.status(500).end();
    });
});
/*const existingContact = data.find((contact) => contact.name === body.name);
  if (existingContact) {
    return response.status(400).json({
      error: "El nombre ya esta en uso.",
    });
  }*/

// const contact =  new Contacto({
//   name: body.name,
//   number: body.number
//id: generateId(),
//});

//data = data.concat(contact);

//response.json(contact);

app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "El nombre o el número no pueden estar vacíos",
    });
  }

  const updatedContact = {
    name: body.name,
    number: body.number,
  };

  Contacto.findByIdAndUpdate(id, updatedContact, {
    new: true,
    runValidators: true,
  })
    .then((updatedContact) => {
      if (updatedContact) {
        response.json(updatedContact);
      } else {
        response.status(404).send({ error: "Contacto no encontrado" });
      }
    })
    .catch(error => next(error))
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto: ${PORT}`);
});
