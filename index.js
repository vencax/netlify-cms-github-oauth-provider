require('dotenv').config({ silent: true })

const express = require('express')
const exphbs = require('express-handlebars')
const oAuth2Factory = require('./src/oAuth2Factory')
const { LABELS } = require('./src/constants')

const app = express()

app.use(express.static('public'))

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

const oAuth2 = oAuth2Factory()
const authorizationUri = oAuth2.authorizeUrl()

app.get('/', (req, res) => {
  const providerLabel = LABELS[oAuth2.getProvider()]

  res.render('index', {
    title: `Netlify ${providerLabel} Authorization`,
    providerLabel
  })
})

app.get('/auth', (req, res) => {
  res.redirect(authorizationUri)
})

app.get('/callback', (req, res) => {
  const { query } = req

  const renderCallback = ({ content, message }) => {
    const provider = oAuth2.getProvider()

    return res.render('callback', {
      content: JSON.stringify(content),
      message,
      provider,
      title: `${LABELS[provider]} OAuth Callback`
    })
  }

  return oAuth2.accessToken(query).then(renderCallback)
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`gandalf is walkin' on port ${port}`)
})
