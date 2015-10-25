import Tast, { KEYS } from 'tast'

const keyboard = new Tast().listen(window)

const controles = {
  right: [KEYS.D, KEYS.RIGHT],
  left: [KEYS.A, KEYS.LEFT],
  jump: [KEYS.W, KEYS.SPACE, KEYS.UP],
  up: [KEYS.W, KEYS.UP],
  down: [KEYS.S, KEYS.DOWN],
}

const update = () => {
  const state = keyboard.save()

  return {
    ...state,
    down: a => state.down(a),
    up: a => state.up(a),
    x: (state.down(controles.right) && 1) - (state.down(controles.left) && 1) || 0,
    y: (state.down(controles.down) && 1) - (state.down(controles.up) && 1) || 0,
    jump: state.down(controles.jump) ? 1 : 0
  }
}

export default { update }
