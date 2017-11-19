require('dotenv').config({silent: true})

const express = require('express')
const simpleOauthModule = require('simple-oauth2')
const randomstring = require('randomstring')

const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  REDIRECT_URL,
  OAUTH_AUTHORIZE_PATH,
  OAUTH_TOKEN_PATH,
  GIT_HOSTNAME,
  SCOPES,
  PORT,
} = process.env

const DEFAULTS = {
  GIT_HOSTNAME: 'https://github.com',
  OAUTH_AUTHORIZE_PATH: '/login/oauth/authorize',
  PORT: 3000,
  SCOPES: 'repo,user',
  TOKEN_PATH: '/login/oauth/access_token',
}

const port = PORT || DEFAULTS.PORT
const app = express()

const oauth2 = simpleOauthModule.create({
  client: {
    id: OAUTH_CLIENT_ID,
    secret: OAUTH_CLIENT_SECRET
  },
  auth: {
    tokenHost: GIT_HOSTNAME || DEFAULTS.GIT_HOSTNAME,
    tokenPath: OAUTH_TOKEN_PATH || DEFAULTS.TOKEN_PATH,
    authorizePath: OAUTH_AUTHORIZE_PATH ||DEFAULTS.OAUTH_AUTHORIZE_PATH,
  }
})

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: REDIRECT_URL,
  scope: SCOPES || DEFAULTS.SCOPES,
  state: randomstring.generate(32)
})

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  res.redirect(authorizationUri)
})

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code
  const options = {
    code: code
  }

  oauth2.authorizationCode.getToken(options, (error, result) => {
    let mess, content

    if (error) {
      console.error('Access Token Error', error.message)
      mess = 'error'
      content = JSON.stringify(error)
    } else {
      const token = oauth2.accessToken.create(result)
      mess = 'success'
      content = {
        token: token.token.access_token,
        provider: 'github'
      }
    }

    const script = `
    <script>
    (function() {
      function recieveMessage(e) {
        console.log("recieveMessage %o", e)
        // send message to main window with da app
        window.opener.postMessage(
          'authorization:github:${mess}:${JSON.stringify(content)}',
          e.origin
        )
      }
      window.addEventListener("message", recieveMessage, false)
      // Start handshare with parent
      console.log("Sending message: %o", "github")
      window.opener.postMessage("authorizing:github", "*")
      })()
    </script>`
    return res.send(script)
  })
})

app.get('/success', (req, res) => {
  res.send('')
})

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Github</a>')
})

app.listen(port, () => {
  console.log("gandalf is walkin' on port " + port)
})
