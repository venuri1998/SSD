const express = require('express')
const googleUtil = require('../utils/google-util')

const router = express.Router()

const controller = require('../controllers/index.controller')

// middleware to check and save session cookie
const setCookie = async(req, res, next) => {
    console.log('SET COOKIE FUNC')
    googleUtil.getGoogleAccountFromCode(req.query.code, (err, res) => {
        console.log('SET COOKIE FUNC - GET GG ACC')
        if (err) {
            res.json({ err: true, msg: 'user should be logged in' })
        } else {
            req.session.user = res
        }
        next()
    })
}


// home 
router.get('/', controller.home)

// login
// redirect to authentication uri
router.get('/login', controller.login)

// redirect uri
router.get('/redirect', setCookie, controller.redirect)

// directing page
/* before landing to dashboard session cookie needs to be checked
 * but cookie will not save unless a view is rendered to the user
 * this will render a simple view to save cookie in the front end (browser)
 */
router.get('/redirect-page', controller.redirect_view)

// view page
router.get('/view', controller.view)

// add event 
router.post('/add-event', controller.add_event)


// send mail 
router.post('/send-mail', controller.send_mail)




module.exports = router