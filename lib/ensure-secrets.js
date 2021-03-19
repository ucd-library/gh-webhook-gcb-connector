const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const config = require('../config');
const client = new SecretManagerServiceClient();

// ensure either
// - secrets have been set as env variables
// - the name of the secrets in Google Cloud Secret Manager have been set as env variables
module.exports = async () => {
  console.log('Ensuring secrets are set');

  if( !config.apiKey ) {
    if( !config.secretNameEnvVars.apiKeySecretName ) {
      console.error('neither API_KEY or API_KEY_SECRET_NAME env vars set.');
      process.exit(-1);
    }

    config.apiKey = await loadLatestSecret(config.secretNameEnvVars.apiKeySecretName);
  }

  if( !config.gcbSecret ) {
    if( !config.secretNameEnvVars.gcbSecretSecretName ) {
      console.error('neither GCB_SECRET or GCB_SECRET_SECRET_NAME env vars set.');
      process.exit(-1);
    }

    config.gcbSecret = await loadLatestSecret(config.secretNameEnvVars.gcbSecretSecretName);
  }

  if( !config.githubSecret ) {
    if( !config.secretNameEnvVars.githubSecretSecretName ) {
      console.error('neither GITHUB_SECRET or GITHUB_SECRET_SECRET_NAME env vars set.');
      process.exit(-1);
    }

    config.githubSecret = await loadLatestSecret(config.secretNameEnvVars.githubSecretSecretName);
  }
}

async function loadLatestSecret(name) {
  let resp = await client.accessSecretVersion({
    name: `projects/${config.projectName}/secrets/${name}/versions/latest`
  });
  return resp[0].payload.data.toString('utf-8');
}