require('dotenv').config();

module.exports = {
  KEYCLOAK: JSON.parse(process.env.KEYCLOAK),
  SERVICETOKEN: JSON.parse(process.env.SERVICETOKEN),
  limitReferer: process.env.LIMITREFERER,
  allowedReferers: process.env.ALLOWEDREFERERS,
};
