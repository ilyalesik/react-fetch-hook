var React = require("react");

var flattenInput = require("./utils/flattenInput");

/**
 * Hook that uses the callFunction to return state
 * @param {()=>{}} callFunction , return fetch function, depends on formatter boolean option
 * @returns {Object} {data, isLoading, error, abort}
 */
function usePromise(callFunction) {
  var inputs = Array.prototype.slice.call(arguments, [1]); // options
  
  //if abort option is activated
  let controller;
  if (inputs[1].abortController) {
    controller = new AbortController();
    inputs[1].signal = controller.signal;
  }
  const abortFn = () => (controller ? controller.abort() : null);

  var state = React.useState({
    isLoading: !!callFunction,
  });

  React.useEffect(function () {
    if (!callFunction) {
      return;
    }
    !state[0].isLoading &&
      state[1]({ data: state[0].data, isLoading: true, abort: abortFn });
    callFunction
      .apply(null, inputs)
      .then(function (data) {
        state[1]({
          data: data,
          isLoading: false,
          abort: abortFn,
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
