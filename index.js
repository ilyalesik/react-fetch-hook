var usePromise = require('./usePromise')

function UseFetchError (status, statusText, message, fileName, lineNumber) {
  var instance = new Error(message, fileName, lineNumber)
  instance.name = 'UseFetchError'
  instance.status = status
  instance.statusText = statusText
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this))
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, UseFetchError)
  }
  return instance
}

UseFetchError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

Object.setPrototypeOf(UseFetchError, Error)

function useFetch (
  path,
  options,
  specialOptions
) {
  var blocked = ((specialOptions && specialOptions.depends) ||
      (options && options.depends) || [])
    .reduce(function (acc, dep) { return acc || !dep }, false)
  return usePromise(!blocked && function (p, o, s) {
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

module.exports = useFetch
