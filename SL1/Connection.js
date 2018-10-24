let fetch = require('node-fetch')
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false
})

let Connection = function(params) {
  this.params = params
}

function toQuery(obj) {
  return Object.keys(obj).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
  }).join('&')
}

function join_url() {
  let joined = ''
  let ends = true
  for (let i in arguments) {
    begins = (arguments[i].charAt(0) == '/')
    if (ends && begins) {
      joined = joined.slice(-1) + arguments[i]
    } else if (!ends && !begins) {
      joined = joined + '/' + arguments[i]
    } else {
      joined += arguments[i]
    }
    ends = (joined.charAt(joined.length - 1) == '/')
  }
  return joined
}

Connection.prototype = {
  send: function(request) {
    let headers = new fetch.Headers()
    let { connection, path, method, payload, query } = request
    let { username, password, origin } = connection.params
    let url = join_url(origin, path)
    if (query) url += '?' + toQuery(query)
    console.log(url)
    headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'))
    headers.append('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    options = { agent, method, headers }
    if (payload) options.body = JSON.stringify(payload)
    //console.log(options)
    return fetch(url, options).then( response => {
      //response.text().then(text => console.log('xxx', text))
      return (request.parser == 'text') ? response.text() : response.json()
    })
  },
  listAssetsRequest(filters) {
    var request = {
      method: 'GET',
      connection: this,
      path: '/api/device',
      query: filters
    }
    request.send = function() {
      return request.connection.send(request)
    }
    return request
  },
  getAnyResourceRequest(path, filters) {
    var request = {
      method: 'GET',
      connection: this,
      path: path + '/vitals',
      query: filters
    }
    request.send = function() {
      return request.connection.send(request)
    }
    return request
  },
  getAssetRequest(id) {
    var request = {
      method: 'GET',
      connection: this,
      path: `/api/device/${id}`
    }
    request.send = function() {
      return request.connection.send(request)
    }
    return request
  },
  describeAPIRequest() {
    var request = {
      method: 'GET',
      connection: this,
      path: '/opt/iservices/scripts/swagger.yml',
      parser: 'text'
    }
    request.send = function() {
      return request.connection.send(request)
    }
    return request
  },
  uploadIntegrationApplicationRequest(appManifestPath) {
    var request = {
      method: 'POST',
      connection: this,
      path: `/api/v1/applications`,
      payload: require(['..', appManifestPath].join('/')),
      parser: 'text'
    }
    console.log(request)
    request.send = function() {
      return request.connection.send(request)
    }
    return request
  },
  getIntegrationApplicationRequest(appName) {
    var request = {
      method: 'GET',
      connection: this,
      path: `/api/v1/applications/${appName}`
    }
    request.send = function() {
      return request.connection.send(request)
    }
    return request
  },
  getStepRequest: function(stepName) {
    var request = {
      method: 'GET',
      connection: this,
      path: `/api/v1/steps/${stepName}`
    }
    request.send = function() {
      return request.connection.send(request)
    }
    return request
  }
}

module.exports = {
  Connection
}

