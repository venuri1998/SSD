const express = require('express')
const session = require('express-session');
const nunjucks = require('nunjucks')
const path = require('path')

const indexRouter = require('./routes/index.route')

const app = express()

require('dotenv').config()

// // nunjucks config
// nunjucks.configure('views', {
//     autoescape: true,
//     express: app
// });

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// used to parse JSON bodies
app.use(express.json())

//parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

app.use(
    session({
        name: 'sid',
        saveUninitialized: false,
        resave: false,
        secret: 'sssh, quiet! it\'s a secret!',
        cookie: {
            maxAge: 1000 * 60 * 60 * 2,
            sameSite: true,
            secure: process.env.NODE_ENV === 'production'
        }
    })
)

// index route
app.use('', indexRouter)


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server started on port ${PORT}`))

module.exports = app