
const CMS_MESSAGE_SUCCESS = 'success'
const CMS_MESSAGE_ERROR = 'error'

const LABELS = {
  bitbucket: 'Bitbucket',
  github: 'GitHub',
  gitlab: 'GitLab'
}

const BITBUCKET_SETTINGS = {
  GIT_HOSTNAME: 'https://bitbucket.org',
  OAUTH_AUTHORIZE_PATH: '/site/oauth2/authorize',
  OAUTH_TOKEN_PATH: '/site/oauth2/access_token',
  SCOPES: null // implicit 'account,repository,repository:write,repository:admin,pullrequest,pullrequest:write'
}

const GITHUB_SETTINGS = {
  GIT_HOSTNAME: 'https://github.com',
  OAUTH_AUTHORIZE_PATH: '/login/oauth/authorize',
  OAUTH_TOKEN_PATH: '/login/oauth/access_token',
  SCOPES: 'repo,user'
}

const GITLAB_SETTINGS = {
  GIT_HOSTNAME: 'https://gitlab.com',
  OAUTH_AUTHORIZE_PATH: '/oauth/authorize',
  OAUTH_TOKEN_PATH: '/oauth/token',
  SCOPES: 'api'
}

module.exports = {
  CMS_MESSAGE_ERROR,
  CMS_MESSAGE_SUCCESS,
  BITBUCKET_SETTINGS,
  GITHUB_SETTINGS,
  GITLAB_SETTINGS,
  LABELS
}
