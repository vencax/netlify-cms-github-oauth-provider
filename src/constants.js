
const CMS_MESSAGE_SUCCESS = 'success'
const CMS_MESSAGE_ERROR = 'error'

const GITHUB_SETTINGS = {
  CMS_PROVIDER: 'github',
  GIT_HOSTNAME: 'https://github.com',
  OAUTH_AUTHORIZE_PATH: '/login/oauth/authorize',
  SCOPES: 'repo,user',
  TOKEN_PATH: '/login/oauth/access_token'
}

module.exports = {
  CMS_MESSAGE_ERROR,
  CMS_MESSAGE_SUCCESS,
  GITHUB_SETTINGS
}
