# Netlify-cms-github-oauth-provider

***External authentication providers were enabled in netlify-cms version 0.4.3. Check your web console to see your netlify-cms version.***

[netlify-cms](https://www.netlifycms.org/) has its own github OAuth client. This implementation was created by reverse engineering the results of that client, so it's not necessary to reimplement client part of [netlify-cms](https://www.netlifycms.org/).

Github and Github Enterprise are currently supported, but as this is a general Oauth client, feel free to submit a PR to add other git hosting providers.

## 1) Install Locally

**Install Repo Locally**

```
git clone https://github.com/vencax/netlify-cms-github-oauth-provider
cd netlify-cms-github-oauth-provider
npm install
```

**Create Oauth App**
Information is available on the [Github Developer Documentation](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/registering-oauth-apps/). Fill out the fields however you like, except for **authorization callback URL**. This is where Github will send your callback after a user has authenticated, and should be `https://your.server.com/callback` for use with this repo.

## 2) Config

### Auth Provider Config

Configuration is done with environment variables, which can be supplied as command line arguments, added in your app  hosting interface, or loaded from a .env ([dotenv](https://github.com/motdotla/dotenv)) file.

**Example .env file:**

```
NODE_ENV=production
OAUTH_CLIENT_ID=f432a9casdff1e4b79c57
OAUTH_CLIENT_SECRET=pampadympapampadympapampadympa
REDIRECT_URL=https://your.server.com/callback
GIT_HOSTNAME=https://github.website.com
```

**Client ID & Client Secret:**
After registering your Oauth app, you will be able to get your client id and client secret on the next page.

**Redirect URL (optional):**
Include this if you  need your callback to be different from what is supplied in your Oauth app configuration.

**Git Hostname (Optional):**
This is only necessary for use with Github Enterprise.

### CMS Config
You also need to add `base_url` to the backend section of your netlify-cms's config file. `base_url` is the live URL of this repo with no trailing slashes.

```
backend:
  name: github
  repo: user/repo   # Path to your Github repository
  branch: master    # Branch to update
  base_url: https://your.server.com # Path to ext auth provider
```

## 3) Push

Basic instructions for pushing to heroku are available in the [original blog post](http://www.vxk.cz/tips/2017/05/18/netlify-cms/).
