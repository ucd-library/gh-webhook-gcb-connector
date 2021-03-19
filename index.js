const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const ensureSecrets = require('./lib/ensure-secrets');
const app = express();


express.use(bodyParser.text({type: '*/*'}));

app.listen(config.server.port, () => {
  console.log('gh-webhook-gcb-connector server running on port: '+config.server.port);
  ensureSecrets();
});
