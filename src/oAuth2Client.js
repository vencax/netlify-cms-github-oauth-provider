const randomString = require('randomstring')
const simpleOauth2 = require('simple-oauth2')
const {
  CMS_MESSAGE_ERROR,
  CMS_MESSAGE_SUCCESS
} = require('./constants')

class OAuth2Client {
  static constructResponse (message, content) {
    return { content, message }
  }

  constructor (provider, credentials, redirectUri = null, scope = null) {
    this.instance = simpleOauth2.create(credentials)

    this.state = null

    this.config = {
      provider,
      redirectUri,
      scope
    }
  }

  constructSuccessResponse (tokenRes) {
    const { token } = this.instance.accessToken.create(tokenRes)
    return OAuth2Client.constructResponse(CMS_MESSAGE_SUCCESS, {
      token: token.access_token,
      provider: this.getProvider()
    })
  }

  constructErrorResponse (error) {
    const getResponse = err => OAuth2Client.constructResponse(CMS_MESSAGE_ERROR, err)
    if (error && error.message) getResponse(error)
    return OAuth2Client.constructResponse(CMS_MESSAGE_ERROR, { message: error })
  }

  getProvider () {
    return this.config.provider
  }

  getStatesEqual (state) {
    return state === this.state
  }

  /**
   * Return authorizeUrl to initiate oAuth-flow
   * @return {String} url that will be redirected to
   */
  authorizeUrl () {
    const { redirectUri: redirect_uri, scope } = this.config
    const state = randomString.generate(32)
    this.state = state
    return this.instance.authorizationCode.authorizeURL({ redirect_uri, scope, state })
  }

  /**
   * Retrieves access_token from oAuth response, handles errors returned from the API
   * @param  {Object} query response query
   * @return {Promise<Object>} resolves to netlify-cms-compatible response object
   */
  async accessToken (query) {
    const { redirectUri: redirect_uri } = this.config

    const {
      code,
      error,
      error_description: errorDescription,
      state
    } = query

    if (!this.getStatesEqual(state)) return this.constructErrorResponse('State does not match supplied value')
    if (error && errorDescription) return this.constructErrorResponse(errorDescription)

    try {
      const tokenRes = await this.instance.authorizationCode.getToken({ code, redirect_uri })
      return this.constructSuccessResponse(tokenRes)
    } catch (error) {
      return this.constructErrorResponse(error)
    }
  }
}

module.exports = OAuth2Client
