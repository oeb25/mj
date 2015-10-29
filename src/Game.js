import { component } from './render'
import { KEYS } from 'tast'
import Keyboard from './Keyboard'
import World from './World'

const init = a => a.update(void(0), { type: 'INIT' })

let i = 0

const create = () => {
  return {
    keyboard: init(Keyboard),
    world: World.update(void(0), { type: 'LOAD', name: 'start' }),
    prev: false
  }
}

let ticks = []

export const update = (state = create(), action) => {
  switch (action.type) {
    case 'TICK':
      const keyboard = Keyboard.update(state.keyboard)

      if (keyboard.down(KEYS.V)) {
        return (state.prev.prev || state.prev) || state
      }

      return { ...state,
        prev: i % 1 == 0 ? state : state.prev,
        keyboard,
        world: World.update(state.world, { type: 'TICK', keyboard })
      };
  }

  return state
}

export const view = ({ state }) => {
  return <c>
    <World state={state.world} />
  </c>
}
