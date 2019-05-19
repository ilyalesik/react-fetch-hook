var usePromise = require('./usePromise')

function useFetch (
  path,
  options,
  specialOptions
) {
  return usePromise(function (p, o, s) {
    if ((s.depends || o.depends || [])
      .reduce(function (acc, dep) { return acc || !dep },
        false)) return Promise.resolve()
    return fetch(p, o)
      .then((o && o.formatter) || function (response) {
        if (!response.ok) throw Error(response.statusText)
        return response.json()
      })
  },
  path, options || {}, specialOptions || {})
}

module.exports = useFetch
