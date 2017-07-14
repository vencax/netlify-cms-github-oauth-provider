require('dotenv').config({silent: true})
const express = require('express')
const simpleOauthModule = require('simple-oauth2')
const randomstring = require('randomstring')
const port = process.env.PORT || 3000

const app = express()
const oauth2 = simpleOauthModule.create({
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  }
})

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: process.env.REDIRECT_URL,
  scope: process.env.SCOPES || 'repo,user',
  state: randomstring.generate(32),
})

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  res.redirect(authorizationUri)
})

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code
  const options = {
    code
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
        console.log("recieveMessage %o", e);
        // send message to main window with da app
        window.opener.postMessage(
          'authorization:github:${mess}:${JSON.stringify(content)}',
          e.origin
        );
      }
      window.addEventListener("message", recieveMessage, false);
      // Start handshare with parent
      console.log("Sending message: %o", "github")
      window.opener.postMessage("authorizing:github", "*");
      })()
    </script>`
    return res.send(script)
  })
})

app.get('/success', (req, res) => {
  res.send('')
})

app.get(['/', '/index.html', '/config.yml'], (req, res, next) => {
  var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
  };

  var fileName = (req.path) ? req.path : 'index.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
})

app.get('/:filename?', (req, res, next) => {
  if (!req.params.filename) {
    res.status(404);
    return next('Not found');
  }

  var options = {
    root: __dirname + '/node_modules/netlify-cms/dist/',
    dotfiles: 'deny',
  };

  var fileName = req.params.filename;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
})

app.listen(port, () => {
  console.log('CMS listening on port ' + port)
})
