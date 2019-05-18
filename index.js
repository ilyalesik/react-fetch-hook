var usePromise = require('./usePromise')

function defaultFormatter (response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response.json()
}

function flatDeps (accumulator, currentValue) {
  return accumulator || !currentValue
}

function fetchInstance (formatter) {
  return function (path, options, specialOptions) {
    var _depends = (specialOptions && specialOptions.depends) ||
        (options && options.depends)
    if (_depends && _depends.reduce(flatDeps, false)) {
      return Promise.resolve()
    }
    return fetch(path, options)
      .then((typeof formatter === 'function' && formatter) || defaultFormatter)
  }
}

function useFetch (
  path,
  options,
  specialOptions
) {
  return usePromise(fetchInstance(options && options.formatter),
    path, options, specialOptions)
}

module.exports = useFetch
