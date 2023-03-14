module.exports = {
  hooks : {
    'dams-v2-sandbox-webhook' : {
      filters : [
        {
          '$event' : 'pull_request',
          action : 'closed',
          pull_request : {
            merged : true,
            base : {
              ref : 'sandbox'
            }
          }
        },
        {
          '$event' : 'push',
          commits : '$exists',
          ref : 'refs/heads/sandbox',
        }
      ],
      repositories : [
        'ucd-library/dams-deployment',
        'ucd-library/dams'
      ]
    },

    'dams-v2-dev-webhook' : {
      filters : [
        {
          '$event' : 'pull_request',
          action : 'closed',
          pull_request : {
            merged : true,
            base : {
              ref : 'dev'
            }
          }
        },
        {
          '$event' : 'push',
          commits : '$exists',
          ref : 'refs/heads/dev',
        }
      ],
      repositories : [
        'ucd-library/dams-deployment',
        'ucd-library/dams'
      ]
    },

    'rp-sandbox-webhook' : {
      filters : [
      {
        '$event' : 'pull_request',
        action : 'closed',
        pull_request : {
          merged : true,
          base : {
            ref : 'sandbox'
          }
        }
      }
      // {
      //   '$event' : 'push',
      //   ref : 'refs/heads/sandbox',
      // }
      ],
      repositories : [
        'ucd-library/rp-ucd-client',
        'ucd-library/vessel'
      ]
    },

    'rp-rebrand-webhook' : {
      filters : [
      // {
      //   '$event' : 'pull_request',
      //   action : 'closed',
      //   pull_request : {
      //     merged : true,
      //     base : {
      //       ref : 'rebrand'
      //     }
      //   }
      // },
      {
        '$event' : 'push',
        ref : 'refs/heads/rebrand',
      }
      ],
      repositories : [
        'ucd-library/rp-ucd-client',
        'ucd-library/vessel'
      ]
    },

    'wp-sandbox-webhook' : {
      filters : [
      // {
      //   '$event' : 'pull_request',
      //   action : 'closed',
      //   pull_request : {
      //     merged : true,
      //     base : {
      //       ref : 'sandbox'
      //     }
      //   }
      // },
      {
        '$event' : 'push',
        ref : 'refs/heads/sandbox',
      }
      ],
      repositories : [
        'UCDavisLibrary/main-wp-website-deployment',
        'UCDavisLibrary/main-wp-website'
      ]
    },

    'wp-stage-webhook' : {
      filters : [
      {
        '$event' : 'pull_request',
        action : 'closed',
        pull_request : {
          merged : true,
          base : {
            ref : 'stage'
          }
        }
      }
      // {
      //   '$event' : 'push',
      //   ref : 'refs/heads/stage',
      // }
      ],
      repositories : [
        'UCDavisLibrary/main-wp-website-deployment',
        'UCDavisLibrary/main-wp-website'
      ]
    },

    'ucdlib-theme-webhook' : {
      filters : [
        {
          '$event' : 'pull_request',
          action : 'closed',
          pull_request : {
            merged : true,
            base : {
              ref : 'main'
            }
          }
        }
        // {
        //   '$event' : 'push',
        //   ref : 'refs/heads/main',
        // }
      ],
      repositories : [
        'ucd-library/ucdlib-theme'
      ]
    }
  },

  projectName : process.env.PROJECT_NAME || 'digital-ucdavis-edu',
  apiKey : process.env.API_KEY || '',
  gcbSecret : process.env.GCB_SECRET || '',
  githubSecret : process.env.GITHUB_SECRET || '',

  // you can either directly store secrets as env variables OR, preferably
  // you store secrets in the Google Cloud Secret Manager, providing the 
  // secret name as the env variables specified below
  secretNameEnvVars : {
    apiKeySecretName : process.env.API_KEY_SECRET_NAME || 'github-webook-api-key',
    gcbSecretSecretName : process.env.GCB_SECRET_SECRET_NAME || 'github-webhook-gcb-secret', 
    githubSecretSecretName : process.env.GITHUB_SECRET_SECRET_NAME || 'github-webhook-github-secret'
  },

  server : {
    port : process.env.PORT || process.env.SERVER_PORT || 3000
  }
}