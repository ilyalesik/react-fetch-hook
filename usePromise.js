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
  //if abort option is activated
  let controller;
  if (inputs.abortController) {
    controller = new AbortController();
    // save reference class: signal = controller.signal
    inputs[signal] = controller.signal;
  }
  // Check if exist abort controller (options or special)
  //if ((o && o?.abortController) || (s && s?.abortController)) {
  // Init AbortController Class: controller = new AbortController();

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
