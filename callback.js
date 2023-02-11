const REQUIRED_ORIGIN_PATTERN = 
  /^((\*|([\w_-]{2,}))\.)*(([\w_-]{2,})\.)+(\w{2,})(\,((\*|([\w_-]{2,}))\.)*(([\w_-]{2,})\.)+(\w{2,}))*$/

if (!process.env.ORIGINS.match(REQUIRED_ORIGIN_PATTERN)) {
  throw new Error('process.env.ORIGIN MUST be comma separated list \
    of origins that login can succeed on.')
}
const origins = process.env.ORIGINS.split(',')

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
        function contains(arr, elem) {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] === elem) {
              return true;
            }
          }
          return false;
        }
        function recieveMessage(e) {
          console.log("recieveMessage %o", e)
          if (!contains(${JSON.stringify(origins)}, e.origin.replace('https://', 'http://').replace('http://', ''))) {
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
