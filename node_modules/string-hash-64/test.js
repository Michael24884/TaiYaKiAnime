const test = require('tape')
const hash = require('./')

test('no collisions in 65 million', t => {
  const n = 65e6
  const collision = Array(n)
  var count = 0
  var i = n

  while (i--) {
    collision[i] = hash(String(i))
  }

  collision.sort((a, b) => {
    if (a === b) {
      count++
    }
    return a - b
  })

  t.equals(count, 0, 'collision count is 0')
  t.end()
})
