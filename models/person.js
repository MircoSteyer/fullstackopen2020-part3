const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const url = process.env.MONGODB_URI

mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
    .then(response => {
        console.log("Connected to MongoDB")})
    .catch(error => {
        console.log({error: error})})

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
        required: true,
    },
    number: {
        type: String,
        minlength: 8,
        unique: false,
        required: true,
    },
},{
    toJSON: {
        transform: (doc, returnedDoc) => {
            returnedDoc.id = returnedDoc._id
            delete returnedDoc._id
            delete returnedDoc.__v
        }
    }
})
personSchema.plugin(uniqueValidator)

module.exports = mongoose.model("Person", personSchema)