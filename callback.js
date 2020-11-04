const url = require('url');
const { URLSearchParams } = url;
const { verify } = require('jsonwebtoken');
const requestToken = require('../lib/request-token');
const { renderSuccess, renderError } = require('../lib/netlify-cms-login');

module.exports = async (req, res) => {
  const queryParams = new URLSearchParams(url.parse(req.url).query);
  const code = queryParams.get('code');
  const state = queryParams.get('state');
  const origin = process.env.ORIGIN;

  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderError(origin, 'Code parameter missing'));
    return;
  }

  verify(state, process.env.JWT_SECRET, (error, _) => {
    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderError(origin, 'Invalid state parameter'));
      return;
    }
  });

  const tokenResponse = await requestToken(code);
  const { access_token, error, error_description } = tokenResponse;

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderError(origin, error));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(renderSuccess(origin, access_token));
};
