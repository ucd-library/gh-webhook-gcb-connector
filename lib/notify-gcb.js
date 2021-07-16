const fetch = require('node-fetch');
const config = require('../config');

module.exports = async (triggerName, substitutions={}) => {
  substitutions._UCD_LIB_INITIATOR = 'gh-webhook-gcb-connector';

  console.log('Requesting: ', getUrl(triggerName).replace(/\?.*/, '[secret]'), JSON.stringify({substitutions}));
  let response = await fetch(getUrl(triggerName), {
    method: 'POST',
    // this is not defined in docs as far as I can tell... but seems to be required.
    headers : {'content-type' : 'application/json'},
    body : JSON.stringify({substitutions}),
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