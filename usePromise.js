var React = require("react");

var flattenInput = require("./utils/flattenInput");

/**
 * Hook that uses the callFunction to return state
 * @param {()=>{}} callFunction , return fetch function, depends on formatter boolean option
 * @returns {Object} {data, isLoading, error}
 *
 *  abort = ()=>{controller.abort()}
 *  abort();
 */
function usePromise(callFunction) {
  var inputs = Array.prototype.slice.call(arguments, [1]); // optiones
  var state = React.useState({
    isLoading: !!callFunction,
  });

  // Check if exist abort controller (options or special)
  //if ((o && o?.abortController) || (s && s?.abortController)) {
  // Init AbortController Class: controller = new AbortController();
  let controller;
  let signal;
  if (inputs.AbortController) {
    controller = new AbortController();
    // save reference class: signal = controller.signal;
    signal = controller.signal;
  }

  React.useEffect(function () {
    if (!callFunction) {
      return;
    }
    !state[0].isLoading && state[1]({ data: state[0].data, isLoading: true });
    callFunction
      .apply(null, { ...inputs, signal })
      .then(function (data) {
        state[1]({
          data: data,
          isLoading: false,
          abort: () => {
            controller.abort();
          },
        });
      })
      .catch(function (error) {
        state[1]({
          error: error,
          isLoading: false,
          abort: () => {},
        });
      });
  }, flattenInput(inputs));

  return state[0];
}

module.exports = usePromise;
