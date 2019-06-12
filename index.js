var usePromise = require('./usePromise')

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
        if (!response.ok) throw Error(response.statusText)
        return response.json()
      })
  },
  path, options || {}, specialOptions || {})
}

module.exports = useFetch
