require('dotenv').config({ silent: true })

const OAuth2Client = require('./oAuth2Client')
const { GITHUB_SETTINGS } = require('./constants')

/**
 * Configures OAuthClient according to env and defaults
 * @return {OAuthClient} instance of OAuthClient
 */
function oAuth2Factory () {
  const {
    GIT_HOSTNAME,
    OAUTH_AUTHORIZE_PATH,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_TOKEN_PATH,
    REDIRECT_URL,
    SCOPES
  } = process.env

  const redirectUri = REDIRECT_URL
  const scopes = SCOPES || GITHUB_SETTINGS.SCOPES

  const credentials = {
    client: {
      id: OAUTH_CLIENT_ID,
      secret: OAUTH_CLIENT_SECRET
    },
    auth: {
      tokenHost: GIT_HOSTNAME || GITHUB_SETTINGS.GIT_HOSTNAME,
      tokenPath: OAUTH_TOKEN_PATH || GITHUB_SETTINGS.TOKEN_PATH,
      authorizePath: OAUTH_AUTHORIZE_PATH || GITHUB_SETTINGS.OAUTH_AUTHORIZE_PATH
    }
  }

  return new OAuth2Client(credentials, redirectUri, scopes)
}

module.exports = oAuth2Factory
