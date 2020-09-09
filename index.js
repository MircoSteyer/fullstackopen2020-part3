const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3001

console.log("does the debugging work?")

let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]



const checkPostForError = (body) => {
    if (!body) return {error: "content missing"}

    if (!body.name) return {error: "no name given"}

    if (!body.number) return {error: "no number given"}

    if (persons.find(person => person.name === body.name)) return {error: `Name "${body.name}" already exists.`}
}
app.use(express.static("build"))

app.use(cors())

app.use(express.json())

morgan.token("content", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

app.get("/", (req,res) => {
    console.log("test")
    res.send(`<h1>Hello World</h1>`)
})

app.get("/api/persons", (req,res) => {
    res.json(persons)
})

app.get("/info", (req,res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        ${new Date()}
        `)
})

app.get("/api/persons/:id", (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) return res.sendStatus(404)
    res.json(person)
})

app.delete("/api/persons/:id", (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) return res.sendStatus(404)
    persons = persons.filter(person => person.id !== id)
    res.sendStatus(204).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    const error = checkPostForError(body)
    if (error) return res.status(400).json(error)

    const person = {
        name: body.name,
        number: body.number,
        id: (Math.random().toFixed(3)*1000)
    }
    persons = persons.concat(person)
    res.status(201).json(person)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: "unknown endpoint"})
}
app.use(unknownEndpoint)

app.listen(port)