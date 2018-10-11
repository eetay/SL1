const SL1 = require('./SL1')
var promisePool = require('tiny-promise-pool')

let sl = new SL1.Connection(require('./config.json'))
let sl2 = new SL1.Connection(require('./config2.json'))


// sl.getStepRequest('stepTemplate').send().then(
//   json => console.log(json.data)
// )

// sl.getIntegrationApplicationRequest('integration_template').send().then(
//   json => console.log(JSON.stringify(json))
// )

// sl.uploadIntegrationApplicationRequest('./samanage-sync/samanage-sync.json').send().then(
//   json => console.log(JSON.stringify(json))
// )

// sl.describeAPIRequest().send().then(
//   text => console.log(text.replace(/=\/static/g, `=https://18.212.47.252/static`))
// )

function sendNext({index, data}) {
  if (!data[index]) return null
  return sl2.getAnyResourceRequest(data[index].URI).send()
}

sl2.listAssetsRequest({'filter.last_poll.min':'1518867900'}).send().then(
  json => {
    //console.log(JSON.stringify(json))
    console.log(json.result_set[0])
    return promisePool({
      threads: 3,
      promises: sendNext,
      context_data: json.result_set
    })
  }
).then(
   json => console.log(JSON.stringify(json))
)


