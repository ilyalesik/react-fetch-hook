var React = require("react");

var flattenInput = require("./utils/flattenInput");

/**
 * Hook that uses the callFunction to return state
 * @param {()=>{}} callFunction , return fetch function, depends on formatter boolean option
 * @returns {Object} {data, isLoading, error}
 */
function usePromise(callFunction) {
  var inputs = Array.prototype.slice.call(arguments, [1]); // argument: path
  var state = React.useState({
    isLoading: !!callFunction,
  });

  React.useEffect(function () {
    if (!callFunction) {
      return;
    }
    !state[0].isLoading && state[1]({ data: state[0].data, isLoading: true });
    callFunction
      .apply(null, inputs)
      .then(function (data) {
        state[1]({
          data: data,
          isLoading: false,
        });
      })
      .catch(function (error) {
        state[1]({
          error: error,
          isLoading: false,
        });
      });
  }, flattenInput(inputs));

  return state[0];
}

module.exports = usePromise;
