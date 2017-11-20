require('dotenv').config({ silent: true })

const OAuth2Client = require('./oAuth2Client')
const { BITBUCKET_SETTINGS, GITLAB_SETTINGS, GITHUB_SETTINGS } = require('./constants')

const DEFAULT_PROVIDER = 'github'

function getSettingsForProvider (provider) {
  const {
    GIT_HOSTNAME,
    OAUTH_AUTHORIZE_PATH,
    OAUTH_TOKEN_PATH,
    REDIRECT_URL,
    SCOPES
  } = process.env

  const isBitbucket = provider === 'bitbucket'
  const isGitLab = provider === 'gitlab'

  let defaultSettings = GITHUB_SETTINGS

  if (isGitLab) {
    defaultSettings = GITLAB_SETTINGS
  } else if (isBitbucket) {
    defaultSettings = BITBUCKET_SETTINGS
  }

  return {
    redirectUri: isBitbucket ? null : REDIRECT_URL,
    tokenHost: GIT_HOSTNAME || defaultSettings.GIT_HOSTNAME,
    tokenPath: OAUTH_TOKEN_PATH || defaultSettings.OAUTH_TOKEN_PATH,
    scopes: SCOPES || defaultSettings.SCOPES,
    authorizePath: OAUTH_AUTHORIZE_PATH || defaultSettings.OAUTH_AUTHORIZE_PATH
  }
}

/**
 * Configures OAuthClient according to env and defaults
 * @return {OAuthClient} instance of OAuthClient
 */
function oAuth2Factory () {
  const {
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    PROVIDER
  } = process.env

  const provider = PROVIDER || DEFAULT_PROVIDER

  const {
    authorizePath,
    tokenHost,
    tokenPath,
    redirectUri,
    scopes
  } = getSettingsForProvider(provider)

  const credentials = {
    client: {
      id: OAUTH_CLIENT_ID,
      secret: OAUTH_CLIENT_SECRET
    },
    auth: {
      tokenHost,
      tokenPath,
      authorizePath
    }
  }

  return new OAuth2Client(provider, credentials, redirectUri, scopes)
}

module.exports = oAuth2Factory
