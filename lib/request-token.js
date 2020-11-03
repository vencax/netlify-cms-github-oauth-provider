const fetch = require('node-fetch');

module.exports = async (code) => {
  const authParams = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  };

  const body = JSON.stringify(authParams);
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': body.length
    },
    body
  });

  return response.json();
}
