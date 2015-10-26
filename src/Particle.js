// TODO: collecable plz :3import { component } from './render'
import { component } from './render'
import collideable, { COLLIDEWITH } from './collideable'
import * as c from './constants'
import Time from './Time'

const view = ({ state }) => {
  return <c x={state.x} y={state.y}>
    <rect y={0} width={5} height={5} color="blue" />
  </c>
}

export const create = (x = 0, y = 0) => {
  const random = Math.random()

  const update = (state = { x, y, width: 5, height: 5, type: c.PARTICLE, vel: { x: Math.cos(random) * 10, y: Math.sin(random) * 10 } }, action) => {
    switch (action.type) {
      case c.TICK:

        return { ...state, move: state.vel, vel: { x: state.vel.x, y: state.vel.y + 0.1 } }
      case c.BLOCKED:
        return { ...state, vel: {
          x: action.dir.x ? -1.01 * state.vel.x : state.vel.x,
          y: action.dir.y ? -0.99999999 * state.vel.y : state.vel.y
        } }
    }

    return state
  }

  return collideable({
    update, view
  })
}

export default create()
