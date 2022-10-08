var usePromise = require("./usePromise");

function UseFetchError(status, statusText, message, fileName, lineNumber) {
  var instance = new Error(message, fileName, lineNumber);
  instance.name = "UseFetchError";
  instance.status = status;
  instance.statusText = statusText;
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, UseFetchError);
  }
  return instance;
}

UseFetchError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

Object.setPrototypeOf(UseFetchError, Error);

function useFetch (
  path,
  options,
  specialOptions
) {
  var blocked = ((specialOptions && specialOptions.depends) ||
      (options && options.depends) || [])
    .reduce(function (acc, dep) { return acc || !dep }, false)
  return usePromise(!blocked && function (p, o, s) {

    // Check if exist abort controller
    if (o.abortController && o.abortController === true) {
      
      // Init AbortController Class: controller = new AbortController();
      const controller = new AbortController()

      // save reference class: signal = controller.signal;
      const signal = controller.signal

      // remove "abortController" prop from obj
      delete o.abortController

      // add "signal" prop to fetch method
      o.signal = signal
    } 

    return fetch(p, o)
      .then((s && s.formatter) || (o && o.formatter) || function (response) {
        if (!response.ok) {
          throw new UseFetchError(
            response.status,
            response.statusText,
            'Fetch error'
          )
        }
        return response.json()
      })
  },
  path, options || {}, specialOptions || {})
}

module.exports = useFetch;
