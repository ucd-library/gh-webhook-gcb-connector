const config = require('../config');
const notifyGcb = require('./notify-gcb');
const crypto = require('crypto');

module.exports = async (req, res) => {
  console.log('Handling request from', req.get('x-forwarded-for'), req.get('user-agent'));

  // verify request with Github secret
  const hash = crypto.createHmac('sha256', config.githubSecret)
    .update(req.body)
    .digest('hex');
  
  if( 'sha256='+hash !== req.get('X-Hub-Signature-256') ) {
    console.error('Invalid SHA256 match', 'sha256='+hash, req.get('X-Hub-Signature-256'));
    return res.status(401).send('Invalid sha:'+req.get('X-Hub-Signature-256')+' computed='+hash+' bodylength='+req.body.length);
  }

  let payload = JSON.parse(req.body);
  payload['$event'] = req.get('X-GitHub-Event');

  let repository = payload.repository.full_name;
  console.log('Event repository: '+repository);

  let builds = [];
  let substitutions = {
    _GITHUB_EVENT : payload['$event'],
    _GITHUB_ISSUE_NUMBER : payload.number,
    _GITHUB_REPOSITORY : repository
  }

  if( payload.pull_request ) {
    substitutions._GITHUB_PR_USER = (payload.pull_request.user || {}).login;
    substitutions._GITHUB_PR_MERGED_BY = (payload.pull_request.merged_by || {}).login;
  }

  // see which hooks should triggered
  try {
    for( let name in config.hooks ) {
      let hook = config.hooks[name];

      // check that repository is listed in hook
      if( !hook.repositories.includes(repository) ) {
        continue;
      }

      // check payload matches hook filter
      let filter = matchFilters(hook.filters, payload);
      if( !filter ) continue;

      console.log(repository+' triggering gcb trigger: '+name);
      let resp = await notifyGcb(name, substitutions);

      // uncomment for debug
      console.log(repository+' triggered gcb trigger '+name+' response: ', resp);
      
      builds.push({name, statusCode: resp.statusCode, filter});
    }
  } catch(e) {
    return res.status(500).send(e.message);
  }

  let response = {repository};
  if( builds.length ) {
    response.success = true;
    response.buildsTriggered = builds;
  } else {
    response.ignored = true;
  }

  res.status(200).json(response);
}

function matchFilters(filters, payload) {
  for( let filter of filters ) {
    if( isFilterMatch(filter, payload) ) return filter;
  }
  return false;
}

function isFilterMatch(filter={}, payload={}) {
  for( let key in filter ) {
    let value = filter[key];

    if( typeof value === 'object') {
      if( !isFilterMatch(value, payload[key]) ) {
        return false;
      }
      continue;
    }

    if( value === '$exists' ) {
      if( payload[key] === undefined ) {
        console.log(`key: ${key} does not exist in payload`); 
        return false;
      }
      continue;
    }
    
    if( value instanceof RegExp ) {
      if( !value.test(payload[key]) ) {
        console.log(`key: ${key} does not match:`, value + '.test( ' + payload[key] + ' )'); 
        return false;
      }
      continue;
    }

    if( value !== payload[key] ) {
      console.log(`key: "${key}" does not match:`, value + ' != ' + payload[key]); 
      return false;
    }
  }

  return true;
}