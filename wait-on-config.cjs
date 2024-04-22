//@ts-check
require('dotenv').config();

const FUNCTION_NAME = 'template';
// NOTE: 9999 is the default port for netlify dev , see the netlify.toml file
const PORT = process.env.PORT || 9999;
// const IS_TEST = process.env.NODE_ENV === 'test';
const URL = process.env['URL'] || `http://localhost:${PORT}`;
const RESOURCE = `${URL}/.netlify/functions/${FUNCTION_NAME}`;

const opts = {
  resources: [RESOURCE],
  delay: 1000, // initial delay in ms, default 0
  interval: 300, // poll interval in ms, default 250ms
  simultaneous: 1, // limit to 1 connection per resource at a time
  timeout: 30000, // timeout in ms, default Infinity
  tcpTimeout: 1000, // tcp timeout in ms, default 300ms
  window: 1000, // stabilization time in ms, default 750ms

  headers: {
    'x-api-key': process.env['API_KEY'],
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default if not provided
  },
};

module.exports = opts;
