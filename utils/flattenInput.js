function flattenInput () {
  var res = []
  for (var i = 0; i < arguments.length; i++) {
    var input = arguments[i]
    if (input instanceof Array) {
      for (var j = 0; j < input.length; j++) {
        res = res.concat(flattenInput(input[j]))
      }
    } else if (typeof URL !== 'undefined' && input instanceof URL) {
      res = res.concat(input.toJSON())
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
