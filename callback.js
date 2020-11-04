const originPattern = process.env.ORIGIN || ''
if (('').match(originPattern)) {
  console.warn('Insecure ORIGIN pattern used. This can give unauthorized users access to your repository.')
  if (process.env.NODE_ENV === 'production') {
    console.error('Will not run without a safe ORIGIN pattern in production.')
    process.exit()
  }
}

module.exports = (oauth2, oauthProvider) => {
  function callbackMiddleWare (req, res, next) {
    const code = req.query.code
    var options = {
      code: code
    }

    if (oauthProvider === 'gitlab') {
      options.client_id = process.env.OAUTH_CLIENT_ID
      options.client_secret = process.env.OAUTH_CLIENT_SECRET
      options.grant_type = 'authorization_code'
      options.redirect_uri = process.env.REDIRECT_URL
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
          provider: oauthProvider
        }
      }

      const script = `
      <script>
      (function() {
        function recieveMessage(e) {
          console.log("recieveMessage %o", e)
          if (!e.origin.match(${JSON.stringify(originPattern)})) {
            console.log('Invalid origin: %s', e.origin);
            return;
          }
          // send message to main window with da app
          window.opener.postMessage(
            'authorization:${oauthProvider}:${mess}:${JSON.stringify(content)}',
            e.origin
          )
        }
        window.addEventListener("message", recieveMessage, false)
        // Start handshare with parent
        console.log("Sending message: %o", "${oauthProvider}")
        window.opener.postMessage("authorizing:${oauthProvider}", "*")
      })()
      </script>`
      return res.send(script)
    })
  }
  return callbackMiddleWare
}
