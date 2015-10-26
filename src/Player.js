import { component } from './render'
import collideable, { COLLIDEWITH } from './collideable'
import physics from './physics'
import Animation from './Animation'
import texture from '../assets/box.png'
import juice from '../assets/juice.png'
import { slice } from './spritesheet'
import * as c from './constants'

const GRAVITY = 0.2
const JUMPINGPOWER = -8

const create = () => ({
  x: 0,
  y: 100,
  width: 33,
  height: 64,
  vel: 0,
  velx: 0,
  id: Math.random(),
  right: true,
  animate: false,
  move: { x: 0, y: 0 },
  onGround: false,
  type: c.PLAYER
})

const update = (state = create(), action) => {
  switch (action.type) {
    case 'TICK':
      const { keyboard } = action

      const move = {
        x: state.velx,
        y: state.vel
      }

      const vel =
        state.onGround
        ? keyboard.jump && JUMPINGPOWER
        : state.vel + GRAVITY

      return {
        ...state, vel,
        move,
        right: move.x > 0 ? true : move.x < 0 ? false : state.right,
        animate: keyboard.x || (move.y > GRAVITY),
        onGround: false,
        velx: state.velx - (state.velx - keyboard.x * 3) * 0.02
      }
    case c.BLOCKED:
      if (action.dir.y)
        return { ...state, vel: 0, move: { x: 0, y: 0 }, onGround: true }
    case COLLIDEWITH(c.SOLID):
      //console.log('collided with that guy ;)')

      return state
    default:
      return state
  }

  return state
}

const view = ({ state }) => {
  const { right, animate } = state
  const left = !right

  const anim = <Animation frames={slice(texture, { height: 64, width: 64 })} delay={75} conditions={[
      // move right
      [animate && right, [0, 4]],
      // move left
      [animate && left, [4, 4]],
      // right
      [right, [0, 1]],
      // left
      [left, [4, 1]]
    ]}/>

  return <c x={state.x - 10} y={state.y}>
    <Animation frames={slice(juice, { width: 53, height: 64 })} conditions={[
      // move right
      [animate && right, [4, 4]],
      // move left
      [animate && left, [8, 4]],
      // right
      [right, [0, 1]],
      // left
      [left, [0, 1]]
    ]}/>
  </c>
}

const Player = collideable({ update, view })

export default Player
