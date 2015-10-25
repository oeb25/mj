import { filter, curry, head, __ } from 'ramda'

const sign = Math.sing || (a => a / Math.abs(a))

export const move = (state, amt, others) => {
  let tryX = {
    x: state.x + amt.x,
    y: state.y,
    width: state.width,
    height: state.height
  }

  let hitX = filter(intersects(tryX), others)[0]

  const x = hitX
    ? amt.x > 0
      ? hitX.x - state.width
      : hitX.x + hitX.width
    : state.x + amt.x

  let tryY = {
    x,
    y: state.y + amt.y,
    width: state.width,
    height: state.height
  }

  let hitY = filter(intersects(tryY), others)[0]

  const y = hitY
    ? amt.y > 0
      ? hitY.y - state.height
      : hitY.y + hitY.height
    : state.y + amt.y

  return { x, y, hit: [hitX, hitY], blocked: {
    x: state.x + amt.x != x
      ? sign(amt.x)
      : 0,
    y: state.y + amt.y != y
      ? sign(amt.y)
      : 0
  } }
}

const intersects = curry((a, b) => {
  return a.x < b.x + b.width &&
  b.x < a.x + a.width &&

  a.y < b.y + b.height &&
  b.y < a.y + a.height})

const intersections = (others, self) => filter(intersects(self), others)

const handler = (a, others) => {
  const hmm = {
    intersections: () => filter(intersects(a), others),

    intersects: intersects(a)
  }

  return hmm
}

export default { move, handler }
