// TODO: collecable plz :3import { component } from './render'
import { component } from './render'
import collideable, { COLLIDEWITH } from './collideable'
import * as c from './constants'
import Time from './Time'

const MAXAGE = 50
const SIZE = 10

const view = ({ state }) => {
  const size = SIZE - SIZE * (state.age / MAXAGE)

  return <c x={state.x} y={state.y}>
    <circle radius={size} color="#f6d747" />
  </c>
}

export const create = (x = 0, y = 0) => {
  const random = Math.random() * 10
  const min = 0.2
  const max = 0.8
  const speed = (Math.random() * (max - min)) + min

  const update = (state = {
    x, y,
    width: 5,
    height: 5,
    type: c.PARTICLE,
    vel: {
      x: Math.cos(random) * 10 * speed,
      y: Math.sin(random) * 10 * speed
    },
    ignore: [c.PARTICLE, c.PLAYERS],
    age: 0
  }, action) => {
    switch (action.type) {
      case c.TICK:
        if (state.age > MAXAGE) {
          console.log('KILLLL!!!');
          return false
        }

        return [{ ...state, move: state.vel, vel: { x: state.vel.x, y: state.vel.y + 0.2 }, age: state.age + 1 }]
      case c.BLOCKED:
        return [{ ...state, vel: {
          x: action.dir.x ? -0.9 * state.vel.x : state.vel.x,
          y: action.dir.y ? -0.2 * state.vel.y : state.vel.y
        } }]
    }

    return [state]
  }

  return collideable({
    update, view
  })
}

export default create()
