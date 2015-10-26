import { component } from './render'
import transition from './transition'

const view = ({ state }, children) => {
  return <c x={state.x} y={state.y}>
    {children[0]}
  </c>
}

const width = window.innerWidth
const height = window.innerHeight

const update = (state = {x: 0, y: 0}, action) => {

  switch (action.type) {
    case 'TICK':
      return {
        x: -action.x + width / 2,
        y: -action.y + height / 2
      };
  }

  return state
}

const Camera = transition(['x','y'], {view, update})

export default {
  create(x = 0, y = 0) { return Camera.update(void(0), { type: 'INIT' }) },
  ...Camera
}
