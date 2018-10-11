const SL1 = require('./SL1')

let sl = new SL1.Connection(require('./config.json'))

// sl.getStepRequest('stepTemplate').send().then(
//   json => console.log(json.data)
// )

// sl.getIntegrationApplicationRequest('integration_template').send().then(
//   json => console.log(JSON.stringify(json))
// )

sl.uploadIntegrationApplicationRequest('./samanage-sync/samanage-sync.json').send().then(
  json => console.log(JSON.stringify(json))
)

// sl.describeAPIRequest().send().then(
//   text => console.log(text.replace(/=\/static/g, `=https://18.212.47.252/static`))
// )



