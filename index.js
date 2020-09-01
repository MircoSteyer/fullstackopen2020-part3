const express = require("express")
const app = express()
const port = 3001

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

app.use(express.json())

app.get("/", (req,res) => {
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
    console.log(error)
    if (error) return res.status(400).json(error)

    const person = {
        name: body.name,
        number: body.number,
        id: (Math.random().toFixed(3)*1000)
    }
    persons = persons.concat(person)
    res.status(201).json(person)
})

app.listen(port)