# Overview

Initiate Google Cloud Build (GCB), builds from Github Webhooks (GHW).  The Github webhook will POST to Google Cloud Run (GCR) endpoint, verify action to perform, the execute GCB build.  Think of this as a filter service for GitHub messages, filtering to specific (if any) GCB actions.

The `config.js` file in this repository will be responsible for setting up which repositories, with which actions, should preform which builds.

![Overview Diagram](./docs/gh-webhook-gcb-connector.png)


# Adding a trigger

Add a trigger is a three step process:
 - Create a GitHub webhook on your repository that posts to this service
 - Update this service with the proper hook configuration, mapping GitHub webhook message events to Google Cloud Build Triggers
 - Create a Google Cloud Build - Trigger Webhook to preform the action

# Create Github Webhooks

The main webhooks we will focus on are:
  - https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads#pull_request
  - https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads#push

But any Github webhook POST payload can be processed.

Documentation on setting up github webhooks:
https://docs.github.com/en/developers/webhooks-and-events/creating-webhooks

Make sure you set the secret as the github secret stored in the Google Cloud Secret Manager and the url should be the Google Cloud Run url for this service.

# Adding hook to config.js

The following is an example structure for registering GitHub repositories with a
specified Google Cloud Build trigger based on filtering the (JSON) message payload.

```javascript
{
  hooks : {
    // name of google cloud build trigger
    'rp-sandbox-webhook' : {
      // github message filter
      fitler : [{
        action : 'closed',
        pull_request : {
          merged : true,
          base : {
            ref : 'sandbox'
          }
        }
      }],
      // repositories that should trigger build
      repositories : [
        'ucd-library/rp-ucd-client',
        'ucd-library/vessel',
        'ucd-library/rp-ucd-harvest'
      ]
    }
  }
}
```

 - The `hooks` keys are the name of the Google Cloud Build triggers.
 - The `fitler` object must match all provied key/value pairs in the provided Github message, including nested/child objects. In this example: 
   - the `action` must be set to `closed`
   - there must exist a `pull_request` object
   - the `pull_request.merged` property must be set to `true`
   - the `pull_request.base.ref` property must be `sandbox`.  (This is the branch being merged to)
 - The `repositories` array contains the repository names, one of which must be set as the GitHub messages `repository.full_name` property. 

 # Adding Google Cloud Build - Webook Trigger

Docs: https://cloud.google.com/build/docs/automating-builds/create-webhook-triggers

Make sure you set the trigger secret as the secret stored in the Google Cloud Secret Manager.  The API key should already be in the secret Manager

