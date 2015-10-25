import { component } from './render'
import { KEYS } from 'tast'
import { COLLIDEWITH } from './collideable'
import { filter, map, prop, not, curry, equals, compose, __ } from 'ramda'
import Player from './Player'
import Solid, {create as createSolid} from './Solid'
import Collectable, {create as createCollectable} from './Collectable'
import Camera from './Camera'
import physics from './physics'
import * as c from './constants'

const ADDCHILD = 'ADDCHILD'
const INIT = 'INIT'
const TICK = 'TICK'

const updateChild = ({ id, kind, state }, others, action, type = TICK, actions) => {
  let newState = kind.update(state, {
    type,
    keyboard: action.keyboard
  })

  if (newState.move) {
    const { x, y, blocked, hit } = physics.move(newState, newState.move, others.map(prop('state')),)

    let g = hit.filter(a => a)[0]

    if (g)
      actions = [others.filter(a => a.state == g)[0].id, { type: COLLIDEWITH(state.type) }]

    newState = { ...newState, x, y };

    if (blocked.x || blocked.y) {
      newState = hit.filter(a => a)
        .map(a => ({ type: COLLIDEWITH(a.type), dir: blocked }))
        .reduce(kind.update, newState)
    }

    if (!newState) return false


    if (blocked.y == 1)
      return updateChild({
        id, kind,
        state: newState
      }, others, action, c.BLOCKEDDOWN, actions)
  }

  return {
    state: {
      kind, id,
      state: newState
    },
    actions
  }
}

const updateChildren = (action, children) => {
  return children.map(child => updateChild(child, children.filter(a => a !== child), action))
}

const update = (state = { children: [], id: 0, camera: Camera.create(0, 0) }, action) => {
  switch (action.type) {
    case TICK:
      const children = updateChildren(action, state.children).filter(a => a)

      const selectActions = prop('actions')
      const actions = children.filter(selectActions).map(selectActions)

      let ffs = actions.length ? child => {
        const out = actions.reduce((child, [id, action]) =>
          child.id !== id ? child : { ...child, state: child.kind.update(child.state, action) }, child)

        return out
      } : a => a

      return {
        ...state,
        camera: Camera.update(state.camera, {
          type: TICK,
          x: state.children[0].state.x,
          y: state.children[0].state.y
        }),
        children: children.map(compose(ffs, prop('state')))
      }
    case ADDCHILD:
      const { kind } = action
      const id = state.id + 1
      const child = {
        kind, id,
        state: kind.update(void(0), { type: INIT })
      }
      return { ...state, id, children: [...state.children, child] }
    case INIT:
      return [
        { type: ADDCHILD, kind: Player },
        { type: ADDCHILD, kind: createSolid(0, 600, 500, 50) },
        { type: ADDCHILD, kind: createSolid(100, 550, 62, 25) },
        { type: ADDCHILD, kind: createCollectable(110, 520) },
      ].reduce(update, state)
  }

  return state
}

const view = ({ state }) => {
  return <Camera state={state.camera}>
    {state.children.map(Child => <Child.kind state={Child.state} />)}
  </Camera>
}

export default { update, view }
