# Netlify-cms-github-oauth-provider

***External authentication providers were enabled in netlify-cms version 0.4.3. Check your web console to see your netlify-cms version.***

[netlify-cms](https://www.netlifycms.org/) has its own github OAuth client. This implementation was created by reverse engineering the results of that client, so it's not necessary to reimplement client part of [netlify-cms](https://www.netlifycms.org/).

Github, Github Enterprise and Gitlab are currently supported, but as this is a general Oauth client, feel free to submit a PR to add other git hosting providers.

Other implementations in: [Go lang](https://github.com/igk1972/netlify-cms-oauth-provider-go).

## 1) Install Locally

**Install Repo Locally**

```bash
git clone https://github.com/vencax/netlify-cms-github-oauth-provider
cd netlify-cms-github-oauth-provider
npm install
```

**Create Oauth App**
Information is available on the [Github Developer Documentation](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/registering-oauth-apps/) or [Gitlab Docs](https://docs.gitlab.com/ee/integration/oauth_provider.html). Fill out the fields however you like, except for **authorization callback URL**. This is where Github or Gitlab will send your callback after a user has authenticated, and should be `https://your.server.com/callback` for use with this repo.

## 2) Config

### Auth Provider Config

Configuration is done with environment variables, which can be supplied as command line arguments, added in your app hosting interface, or loaded from a .env ([dotenv](https://github.com/motdotla/dotenv)) file.

**Example .env file:**

```ini
NODE_ENV=production
ORIGIN=www.my_organisation.com
OAUTH_CLIENT_ID=f432a9casdff1e4b79c57
OAUTH_CLIENT_SECRET=pampadympapampadympapampadympa
REDIRECT_URL=https://your.server.com/callback
GIT_HOSTNAME=https://github.website.com
PORT=3000
```

__NOTE__: ORIGIN is mandatory and can contain regex (e.g. ```.*.my_organisation.com```)

For Gitlab you also have to provide this environment variables:
```ini
OAUTH_PROVIDER=gitlab
SCOPES=api
OAUTH_AUTHORIZE_PATH=/oauth/authorize
OAUTH_TOKEN_PATH=/oauth/token
```

You can also setup an environment variable to configure "_blank" target when auth window is opened. Default is "_self".
```ini
AUTH_TARGET=_blank
```

**Client ID & Client Secret:**
After registering your Oauth app, you will be able to get your client id and client secret on the next page.

**Redirect URL (optional in github, mandatory in gitlab):**
Include this if you need your callback to be different from what is supplied in your Oauth app configuration.

**Git Hostname (Default github.com):**
This is only necessary for use with Github Enterprise or Gitlab.

**Port number (Default 3000)**
If you do not want to run the app on 3000.

### CMS Config
You also need to add `base_url` to the backend section of your netlify-cms's config file. `base_url` is the live URL of this repo with no trailing slashes.

```yaml
backend:
  name: [github | gitlab]
  repo: user/repo   # Path to your Github/Gitlab repository
  branch: master    # Branch to update
  base_url: https://your.server.com # Path to ext auth provider
```

## 3) Deploy

### Heroku

Basic instructions for pushing to heroku are available in the [original blog post](http://www.vxk.cz/tips/2017/05/18/netlify-cms/).

### Locally
You can run the instance like so:
```bash
npm start
```

Or with commandline provided variables like so:
```bash
PORT=3111 NODE_ENV=production ORIGIN=www.my_organisation.com OAUTH_CLIENT_ID=... OAUTH_CLIENT_SECRET=... npm start
```

If running behind reverse-proxy (e.g. nginx), the `/auth` and `/callback` paths need to be proxied, e.g. like so:
```nginx
 location /auth {
    proxy_pass http://127.0.0.1:3111;
    proxy_pass_request_headers      on;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header Early-Data $ssl_early_data;
}

location /callback {
    proxy_pass http://127.0.0.1:3111;
    proxy_pass_request_headers      on;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header Early-Data $ssl_early_data;
}
```

You may want to run this as a systemd service like so:
```bash
$ cat /etc/systemd/system/oauth-github.service
```

```ini
[Unit]
Description=OAuth provider for Netlify CMS and Github
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=/opt/netlify-cms-github-oauth-provider
ExecStart=/usr/bin/npm run start
Restart=always
Environment=PORT=3111
Environment=ORIGIN=www.my_organisation.com
Environment=OAUTH_CLIENT_ID=...
Environment=OAUTH_CLIENT_SECRET=...

[Install]
WantedBy=multi-user.target
```
