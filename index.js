require('dotenv').config({ silent: true })

const express = require('express')
const exphbs  = require('express-handlebars')
const oAuth2Factory = require('./src/oAuth2Factory')

const port = process.env.PORT || 3000
const app = express()

app.use(express.static('public'))

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

const oAuth2 = oAuth2Factory()
const authorizationUri = oAuth2.getauthorizeURL()

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Netlify Authorization'
  })
})

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  res.redirect(authorizationUri)
})

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const { query: { code } } = req

  const sendScript = ({ message, content }) => {
    return res.render('callback', {
      content: JSON.stringify(content),
      message: message,
      title: 'OAuth Callback'
    })
  }

  return oAuth2.getAccessToken(code).then(sendScript)
})


app.listen(port, () => {
  console.log(`gandalf is walkin' on port ${port}`)
})
