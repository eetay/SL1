const SL1 = require('./SL1')

let sl = new SL1.Connection(require('./config.json'))

// sl.getStepRequest('stepTemplate').send().then(
//   json => console.log(json.data)
// )

sl.getIntegrationApplicationRequest('integration_template').send().then(
  json => console.log(JSON.stringify(json))
)
