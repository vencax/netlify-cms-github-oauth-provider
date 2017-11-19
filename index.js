require('dotenv').config({ silent: true })

const express = require('express')
const oAuth2Factory = require('./src/oAuth2Factory')

const port = process.env.PORT || 3000
const app = express()

const oAuth2 = oAuth2Factory()
const authorizationUri = oAuth2.getauthorizeURL()

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  res.redirect(authorizationUri)
})

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const { query: { code } } = req

  const sendScript = ({ message, content }) => {
    console.log(message, content)

    const script = `
    <script>
    (function() {
      function recieveMessage(e) {
        console.log("recieveMessage %o", e)
        // send message to main window with da app
        window.opener.postMessage(
          'authorization:github:${message}:${JSON.stringify(content)}',
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
  }

  return oAuth2.getAccessToken(code).then(sendScript)
})

app.get('/success', (req, res) => {
  res.send('')
})

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Github</a>')
})

app.listen(port, () => {
  console.log(`gandalf is walkin' on port ${port}`)
})
