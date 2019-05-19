var React = require('react')

var flattenInput = require('./src/flattenInput')

function usePromise (
  callFunction
) {
  var inputs = Array.prototype.slice.call(arguments, [1])
  var state = React.useState({
    data: null,
    isLoading: false
  })

  function call () {
    if (!callFunction) {
      return
    }
    state[1]({ isLoading: true })
    callFunction.apply(null, inputs)
      .then(function (data) {
        state[1]({
          data: data,
          isLoading: false
        })
      })
      .catch(function (error) {
        state[1]({
          error: error,
          isLoading: false
        })
      })
  }

  React.useEffect(call, flattenInput(inputs))

  return state[0]
}

module.exports = usePromise
