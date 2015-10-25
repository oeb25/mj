import { component } from './render'
import transition from './transition'

const view = ({ state }, children) => {
  return <c x={state.x} y={state.y}>
    {children[0]}
  </c>
}

const update = (state = {x: 0, y: 0}, action) => {

  switch (action.type) {
    case 'TICK':
      return {
        x: -action.x + 1280 / 2,
        y: -action.y + 635 / 2
      };
  }

  return state
}

const Camera = transition(['x','y'], {view, update})

export default {
  create(x = 0, y = 0) { return Camera.update(void(0), { type: 'INIT' }) },
  ...Camera
}
