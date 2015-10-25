// TODO: collecable plz :3import { component } from './render'
import { component } from './render'
import collideable, { COLLIDEWITH } from './collideable'
import * as c from './constants'
import Time from './Time'

const view = ({ state }) => {
  return <c x={state.x} y={state.y}>
    <Time>{t =>
      <rect y={Math.sin(t/100) * 5} width={5} height={5} color="blue" />
    }</Time>
  </c>
}

export const create = (x = 0, y = 0) => {
  const update = (state = { x, y, width: 5, height: 5, type: c.COLLECTABLE }, action) => {
    switch (action.type) {
      case COLLIDEWITH(c.PLAYER):

        return false
    }

    return state
  }

  return collideable({
    update, view
  })
}

export default create()
