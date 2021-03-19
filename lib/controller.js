const config = require('../config');
const notifyGcb = require('./notify-gcb');
const crypto = require('crypto');

module.exports = async (req, res) => {
  console.log('Handling request from', req.get('x-forwarded-for'), req.get('user-agent'));

  // verify request with Github secret
  const hash = crypto.createHmac('sha256', config.githubSecret)
    .update(req.body.trim())
    .digest('hex');
  
  if( 'sha256='+hash !== req.get('X-Hub-Signature-256') ) {
    console.error('Invalid SHA256 match', 'sha256='+hash, req.get('X-Hub-Signature-256'));
    return res.status(401).send('');
  }

  let payload = JSON.parse(req.body);
  let repository = payload.repository.full_name;
  let builds = [];

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

      console.log(repositories+' triggering gcb trigger: '+name);
      let resp = await notifyGcb(name);
      console.log(repositories+' triggering gcb trigger '+name+' response: ', resp);
      builds.push({name, statusCode: resp.statusCode, filter});
    }
  } catch(e) {
    return res.status(500).send(e.message);
  }


  res.status(200).json({
    success: true,
    repository: repository,
    buildsTriggered : builds
  });
}

function matchFilters(filters, payload) {
  for( let filter of filters ) {
    if( isFilterMatch(filter, payload) ) return true;
  }
}

function isFilterMatch(filter={}, payload={}) {
  for( let key in filter ) {
    let value = filter[key];

    if( typeof value === 'object') {
      if( !isFilterMatch(value, payload[key]) ) {
        return false;
      }
    }

    if( value === '$exists' && payload[key] !== undefined ) {
      continue; 
    }

    if( value !== payload[key] ) {
      return false;
    }
  }

  return true;
}