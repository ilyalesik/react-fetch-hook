function flattenInput () {
  var res = []
  for (var i = 0; i < arguments.length; i++) {
    var input = arguments[i]
    if (input instanceof Array) {
      for (var j = 0; j < input.length; j++) {
        res = res.concat(flattenInput(input[j]))
      }
    } else if (input instanceof URL) {
      res = res.concat([
        input.hash,
        input.host,
        input.hostname,
        input.href,
        input.origin,
        input.password,
        input.pathname,
        input.port,
        input.protocol,
        input.search,
        input.username])
    } else if (input instanceof Object) {
      var keys = Object.keys(input)
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k]
        res = res.concat([key]).concat(flattenInput(input[key]))
      }
    } else {
      res = res.concat(input)
    }
  }
  return res
}

module.exports = flattenInput
