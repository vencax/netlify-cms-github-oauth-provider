# netlify-cms-github-oauth-provider

[netlify-cms](https://www.netlifycms.org/) has their own github OAuth client.
This implementation is result of reverse engineering of results provided by that client.
So it is not necessary to reimplement client part of [netlify-cms](https://www.netlifycms.org/).

This is actually general OAuth client so theorethically it could be more universal and provide auth for variety of GIT hostings.
But now only github is necessary. Feel free ti file PR if you need another one.

## installation & config

For install:

```
git clone https://github.com/vencax/netlify-cms-github-oauth-provider
cd netlify-cms-github-oauth-provider
npm install
```

Its configurable with environment variables.
You can set them manualy or use .env ([dotenv](https://github.com/motdotla/dotenv)) file and it loads them from it.
Example of that file:

```
NODE_ENV=production
OAUTH_CLIENT_ID=f432a9casdff1e4b79c57
OAUTH_CLIENT_SECRET=pampadympapampadympapampadympa
REDIRECT_URL=https://your.server.running.this.code/callback
```

For using with github, you need to setup OAut application on github site.
For details see [https://www.netlify.com/docs/authentication-providers/](https://www.netlify.com/docs/authentication-providers/).

It's also necessary to set up the `base_url` in your Netlify CMS `backend` configuration. See [example](https://github.com/pirati-web/admin/blob/0878c1f2f0b16dee5ed6bab6228bbebd7d540247/config.yml#L5).
