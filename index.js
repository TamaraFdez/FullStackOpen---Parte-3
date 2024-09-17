const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require('path')

/*let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];*/

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(cors()); 
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));
//GET
/*app.get("/", (resquest, response) => {
  response.send("<h1>Lista telefónica</h1>");
});*/
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
app.get("/api/persons", (request, response) => {
  response.json(data);
});

//Hora y contador
app.get("/info", (request, response) => {
  const time = new Date();
  const count = data.length;
  response.send(`
    <p>La agenda tiene información de ${count} personas</p>
    <p>Solicitud recibida a las: ${time}</p>
  `);
});

//Get de un solo contacto
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const contact = data.find((contact) => contact.id === id);

  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

//detele
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  data = data.filter((contact) => contact.id !== id);

  response.status(204).end();
});

//POST
const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000000);
  return randomId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "No hay Número o Nombre",
    });
  }

  const existingContact = data.find((contact) => contact.name === body.name);
  if (existingContact) {
    return response.status(400).json({
      error: "El nombre ya esta en uso.",
    });
  }

  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  data = data.concat(contact);

  response.json(contact);
});

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto: ${PORT}`);
});
