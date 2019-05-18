var React = require('react')
var flattenInput = require('./src/flattenInput')

function usePromise (
  callFunction
) {
  var inputs = Array.prototype.slice.call(arguments, [1])
  var dataState = React.useState(null)
  var loadingState = React.useState(false)
  var errorState = React.useState()

  function call () {
    if (!callFunction) {
      return
    }
    loadingState[1](true)
    callFunction.apply(this, inputs)
      .then(function (data) {
        dataState[1](data)
        errorState[1](undefined)
        loadingState[1](false)
      })
      .catch(function (error) {
        errorState[1](error)
        loadingState[1](false)
      })
  }

  React.useEffect(call, flattenInput(inputs))

  return {
    data: dataState[0],
    isLoading: loadingState[0],
    error: errorState[0]
  }
}

module.exports = usePromise
