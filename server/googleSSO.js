const { google } = require('googleapis');

const g = {};

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: process.env.NODE_ENV === 'production' ? 'http://www.thydo.com' : 'http://dev.thydo.com',
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
  return google.plus({ version: 'v1', auth });
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
  const me = await plus.people.get({ userId: 'me' });
  const userGoogleId = me.data.id;
  const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
  const userGoogleDisplayName = me.data && me.data.displayName;
  const userGoogleAvatar = me.data.image && me.data.image.url;
  return {
    googleId: userGoogleId,
    email: userGoogleEmail,
    displayName: userGoogleDisplayName,
    avatar: userGoogleAvatar,
    tokens: tokens,
    lang: me.data.language,
  };
};

module.exports = g;
