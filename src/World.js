import { component } from './render'
import { KEYS } from 'tast'
import { COLLIDEWITH } from './collideable'
import { filter, map, prop, not, curry, equals, compose, __ } from 'ramda'
import Player from './Player'
import Solid, {create as createSolid} from './Solid'
import Collectable, {create as createCollectable} from './Collectable'
import Particle, {create as createParticle} from './Particle'
import Camera from './Camera'
import physics from './physics'
import * as c from './constants'
import Sound from './Sound'

const ADDCHILD = 'ADDCHILD'
const INIT = 'INIT'
const TICK = 'TICK'

const updateChild = ({ id, kind, state }, others, action, type = TICK) => {
  let newState = kind.update(state, {
    type,
    keyboard: action.keyboard
  })
  if (!newState) return false

  let actions

  [newState, actions = []] = newState

  if (newState.move) {
    const { x, y, blocked, hit } = physics.move(newState, newState.move, others.map(prop('state')),)

    let g = hit.filter(a => a)[0]

    if (g)
      actions = [...actions, {
        type: c.NOTIFY,
        id: others.filter(a => a.state == g)[0].id,
        action: { type: COLLIDEWITH(state.type) }
      }]

    newState = { ...newState, x, y };

    if (blocked.x || blocked.y) {
      [newState, actions] = [
        ...hit.filter(a => a)
          .map(a => ({ type: COLLIDEWITH(a.type), dir: blocked })),
        { type: c.BLOCKED, dir: blocked }
      ].reduce(([state, actions], action) => {
        const [s, a = []] = kind.update(state, action)

        return [s, [...actions, ...a]]
      }, [newState, actions])
    }

    if (!newState) return false
  }

  return {
    kind, id,
    state: newState,
    actions
  }
}

const updateChildren = (action, children) => {
  return children.map(child =>
    updateChild(child, children.filter(a => {
      if (a === child)
        return false

      if (child.state.ignore) {

        return child.state.ignore.indexOf(a.state.type) == -1
      }

      return true
    })
    , action))
}

const ACTIONS = {
  [c.NOTIFY]: (state, action) => {
    const child = state.children.filter(child => child.id === action.id)[0]
    const others = state.children.filter(child => child.id !== action.id)

    return {
      ...state,
      children: [
        ...others,
        { ...child, state: child.kind.update(child.state, action.id)[0] }
      ].sort((a, b) => a.id - b.id)
    }
  }
}

const update = (state = { children: [], id: 0, camera: Camera.create(0, 0) }, action) => {
  switch (action.type) {
    case TICK:
      const children = updateChildren(action, state.children).filter(a => a.state)

      const selectActions = prop('actions')
      const actions = children.filter(selectActions).map(selectActions).reduce((a, b) => a.concat(b))

      const newState = {
        ...state,
        camera: Camera.update(state.camera, {
          type: TICK,
          x: state.children[0].state.x,
          y: state.children[0].state.y
        }),
        children: children
      }

      const out = actions.reduce(update, newState)

      if (out.children[0].state.y > 1000) {
        Sound.play('die')
        return update(void(0), { type: INIT })
      }

      return out
    case c.NOTIFY:
      return ACTIONS[c.NOTIFY](state, action)
    case ADDCHILD:
      const { kind } = action
      const id = state.id + 1
      const child = {
        kind, id,
        state: kind.update(void(0), { type: INIT })[0]
      }

      return { ...state, id, children: [...state.children, child] }
    case INIT:
      return [
        { type: ADDCHILD, kind: Player },
        { type: ADDCHILD, kind: createSolid(400, 600, 200, 100) },
        { type: ADDCHILD, kind: createSolid(-100, 400, 100, 20) },
        { type: ADDCHILD, kind: createSolid(500, 0, 100, 601) },
      ].reduce(update, state)
    case c.SPAWNPARTICLES:
      return update(state, { type: ADDCHILD, kind: createParticle(action.x, action.y) })
    case 'LOAD':
      const { solids, spawn } = action

      return [
        { type: ADDCHILD, kind: Player },
        ...solids.map(([x, y, w, h]) => ({ type: ADDCHILD, kind: createSolid(x, y, w, h) }))
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
