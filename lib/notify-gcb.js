const fetch = require('node-fetch');
const config = require('../config');

module.exports = async triggerName => {
  let response = await fetch(getUrl(triggerName), {
    method: 'POST',
    // this is not defined in docs as far as I can tell... but seems to be required.
    headers : {'content-type' : 'application/json'},
    body : '{}'
  });
  return {
    statusCode : response.status,
    body : await response.text()
  }
}

// see: https://cloud.google.com/build/docs/automating-builds/create-webhook-triggers#creating_webhook_triggers
function getUrl(triggerName) {
  return `https://cloudbuild.googleapis.com/v1/projects/${config.projectName}/triggers/${triggerName}:webhook?key=${config.apiKey}&secret=${config.gcbSecret}`;
}