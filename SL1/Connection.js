let fetch = require('node-fetch')
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false
})

let Connection = function(params) {
  this.params = params
}

Connection.prototype = {
  send: function(request) {
    let headers = new fetch.Headers()
    let { connection, path, method, payload } = request
    let { username, password, origin } = connection.params
    let url = [origin, path].join('/')
    headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'))
    headers.append('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    options = { agent, method, headers }
    if (payload) options.body = JSON.stringify(payload)
    console.log(options)
    return fetch(url, options).then( response => {
      //response.text().then(text => console.log('xxx', text))
      return (request.parser == 'text') ? response.text() : response.json()
    })
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

