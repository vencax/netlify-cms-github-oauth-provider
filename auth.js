const { URLSearchParams } = require('url');
const { sign } = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

module.exports = (req, res) => {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: 'repo',
    state: sign({ nonce: uuidv4() }, process.env.JWT_SECRET, { expiresIn: 30 })
  };

  res.writeHead(307, {
    'Location': `https://github.com/login/oauth/authorize?${
      new URLSearchParams(params)
    }`
  })
  res.end();
}