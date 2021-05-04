var React = require('react')

var flattenInput = require('./utils/flattenInput')

function usePromise (
  callFunction
) {
  var inputs = Array.prototype.slice.call(arguments, [1])
  var state = React.useState({
    isLoading: !!callFunction
  })

  React.useEffect(function () {
    if (!callFunction) {
      return
    }
    
    var isMounted = true;
    function unMount () {
      isMounted = false;
    }
    
    !state[0].isLoading && state[1]({ data: state[0].data, isLoading: true })
    callFunction.apply(null, inputs)
      .then(function (data) {
        if (isMounted) {
          state[1]({
            data: data,
            isLoading: false
          })
        }
      })
      .catch(function (error) {
        if (isMounted) {
          state[1]({
            error: error,
            isLoading: false
          })
        }
      })
    
    return unMount;
  }, flattenInput(inputs))

  return state[0]
}

module.exports = usePromise
