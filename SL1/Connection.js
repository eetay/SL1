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
    let { connection, path } = request
    let { username, password, origin } = connection.params
    let url = [origin, path].join('/')
    console.log(url)
    headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'))
    headers.append('Accept', 'application/json')
    return fetch(url, {
      agent,
      method: 'GET',
      headers
    }).then( response => {
      //response.text().then(text => console.log('xxx', text))
      return response.json()
    })
  },
  getIntegrationApplicationRequest(appName) {
    var request = {
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

