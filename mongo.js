const mongoose = require("mongoose")

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://tester1:${password}@part-3c-attempt1.zk2mp.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

const Person = mongoose.model("Person", personSchema)

if (!newName || !newNumber) {
    Person.find({}).then(response => {
        console.log("phonebook:")
        if (response.length === 0) console.log("no results fit your criteria")
        response.forEach(note => {
            console.log(`${note.name} ${note.number}`)
        })
        mongoose.connection.close()
    }).catch(e => {
        console.log(e)})
}

if (newName && newNumber) {
    const person = new Person({
        name: newName,
        number: newNumber
    })
    person.save(person).then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`)

        mongoose.connection.close()})

        .catch(e => {
        console.log(e)})
}

