const { Schema, model } = require('mongoose')

const word = new Schema ({
    origin: {
        type: String,
        required: true
    },
    ru: {
        type: String
    }
})


module.exports = model('Words', word)