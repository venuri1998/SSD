const express = require('express')
const path = require('path')

const app = express()


// used to parse JSON bodies
app.use(express.json())

//parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))

module.exports = app