const simpleOauthModule = require('simple-oauth2')
const authMiddleWareInit = require('./auth.js')
const callbackMiddleWareInit = require('./callback')
const oauthProvider = process.env.OAUTH_PROVIDER || 'github'
const loginAuthTarget = process.env.AUTH_TARGET || '_self'

const config = {
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET
  },
  auth: {
    // Supply GIT_HOSTNAME for enterprise github installs.
    tokenHost: process.env.GIT_HOSTNAME || 'https://github.com',
    tokenPath: process.env.OAUTH_TOKEN_PATH || '/login/oauth/access_token',
    authorizePath: process.env.OAUTH_AUTHORIZE_PATH || '/login/oauth/authorize'
  }
}

const oauth2 = new simpleOauthModule.AuthorizationCode(config)

function indexMiddleWare (req, res) {
  res.send(`Hello<br>
    <a href="/auth" target="${loginAuthTarget}">
      Log in with ${oauthProvider.toUpperCase()}
    </a>`)
}

module.exports = {
  auth: authMiddleWareInit(oauth2),
  callback: callbackMiddleWareInit(oauth2, oauthProvider),
  success: (req, res) => { res.send('') },
  index: indexMiddleWare
}
