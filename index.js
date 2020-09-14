require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const port = process.env.PORT
const Person = require("./models/person")

let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]

app.use(express.static("build"))

app.use(cors())

app.use(express.json())

morgan.token("content", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

/*app.get("/", (req,res) => {
    console.log("test")
    res.send(`<h1>Hello World</h1>`)
})*/

app.get("/api/persons", (req,res,next) => {
    Person.find({}).then(people => res.json(people)).catch(error => next(error))
})

app.get("/info", async (req,res) => {
    const peopleCount = await Person.countDocuments({}).exec()
    console.log("peopleCount", peopleCount)
    res.send(`
        <p>Phonebook has info for ${peopleCount} people.</p>
        ${new Date()}
        `)
})

app.get("/api/persons/:id", (req,res,next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (req,res, next) => {

    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()})
        .catch(error => next(error))
})

app.post("/api/persons", async (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(document => res.status(201).json(document))
        .catch(error => next(error))
})

app.put("/api/persons/:id", (req,res,next) => {
    const body = req.body
    const newPerson = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(req.params.id, newPerson, {new: true, runValidators: true, context: "query"})
        .then(newPerson => res.json(newPerson))
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: "unknown endpoint"})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === "CastError") res.status(400).send({error: "malformatted id"})
    if (error.name === "ValidationError") res.status(400).json({error: error.message})

    next(error)
}
app.use(errorHandler)

app.listen(port)