const { google } = require('googleapis');

const g = {};

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: process.env.NODE_ENV === 'production' ? 'https://www.thydo.com' : 'http://dev.thydo.com',
};

const defaultScope = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

g.getConnectionUrl = auth => {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope,
  });
};

function getGooglePlusApi(auth) {
  Object.keys(google).forEach(x => console.log('=>', x));
  return google.oauth2({ version: 'v1', auth });
}

g.createConnection = () => {
  auth = new google.auth.OAuth2(googleConfig.clientId, googleConfig.clientSecret, googleConfig.redirect);
  return auth;
};

let auth;
g.getGoogleAccountFromCode = async code => {
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  auth.setCredentials(tokens);
  const plus = getGooglePlusApi(auth);
  const me = await plus.userinfo.get('me');
  const retObj = {
    googleId: me.data.id,
    email: me.data.email,
    displayName: me.data.name,
    avatar: me.data.picture,
    tokens: tokens,
    lang: me.data.locale,
  };
    return retObj;
};

module.exports = g;
