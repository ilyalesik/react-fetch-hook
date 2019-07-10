var React = require('react')

function usePaginatedRequest (
  request,
  limit
) {
  var depends = Array.prototype.slice.call(arguments, [2])
  var dataState = React.useState([])
  var currentUpdate = React.useRef()
  var offsetState = React.useState(0)
  var hasMoreState = React.useState(true)

  var loadMoreRef = React.useRef(function () {})

  React.useEffect(function () {
    dataState[1]([])
    offsetState[1](0)
    hasMoreState[1](true)
  }, depends)

  React.useEffect(
    function () {
      loadMoreRef.current = async function () {
        if (currentUpdate.current) {
          await currentUpdate.current
        }
        if (hasMoreState[0]) {
          offsetState[1](offsetState[0] + limit)
        }
      }

      var update = async function () {
        var result = await request({ limit: limit, offset: offsetState[0] })
        hasMoreState[1](result.length === limit)
        dataState[1](function (prev) { return [].concat(prev, result) })
      }
      currentUpdate.current = update()
    },
    [offsetState[0]].concat(depends)
  )

  return {
    data: dataState[0],
    loadMore: loadMoreRef.current || function () {},
    hasMore: hasMoreState[0]
  }
}

module.exports = usePaginatedRequest
