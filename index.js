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
    if ((specialOptions.depends ||
        options.depends || []).reduce(flatDeps, false)) return Promise.resolve()
    return fetch(path, options)
      .then(formatter || defaultFormatter)
  }
}

function useFetch (
  path,
  options,
  specialOptions
) {
  return usePromise(fetchInstance(options && options.formatter),
    path, options || {}, specialOptions || {})
}

module.exports = useFetch
