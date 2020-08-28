const express = require("express")
const app = express()
const port = 3001

console.log("this is a test")

const persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]

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
    if (!persons.find(person => person.id === id)) return res.sendStatus(404)
    const person = persons.find(person => person.id === id)
    res.json(person)

})

app.listen(port)