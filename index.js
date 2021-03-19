const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const ensureSecrets = require('./lib/ensure-secrets');
const app = express();

app.use(bodyParser.text({type: '*/*'}));
app.use(require('./lib/controller'));

app.listen(config.server.port, () => {
  console.log('gh-webhook-gcb-connector server running on port: '+config.server.port);
  ensureSecrets();
});
