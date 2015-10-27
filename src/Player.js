import { component } from './render'
import collideable, { COLLIDEWITH } from './collideable'
import physics from './physics'
import Animation from './Animation'
import texture from '../assets/box.png'
import juice from '../assets/juice.png'
import { slice } from './spritesheet'
import * as c from './constants'

const GRAVITY = 0.6
const JUMPINGPOWER = -16
const SPEED = 6
const DRAG = 0.5

const create = () => ({
  x: 0,
  y: 100,
  width: 30,
  height: 60,
  vel: 0,
  velx: 0,
  id: Math.random(),
  right: true,
  animate: false,
  move: { x: 0, y: 0 },
  wasOnGround: false,
  onGround: false,
  isGliding: false,
  force: 0,
  jumps: 0,
  type: c.PLAYER
})

const update = (state = create(), action, dispatch = () => void(0)) => {
  switch (action.type) {
    case 'TICK':
      const { keyboard } = action

      const move = {
        x: state.velx,
        y: state.vel
      }

      let vel = state.vel
      let jumps = state.jumps

      let velx = 0

      if (keyboard.jump) {
        if (state.onGround && jumps > 0) {
          vel = JUMPINGPOWER
          jumps = 0
        } else {
          vel = state.vel + GRAVITY
        }

        if (state.isGliding && state.jumps > 0.5) {
          vel = JUMPINGPOWER
          velx = state.force * JUMPINGPOWER
          jumps = 0
        }
      } else {
        if (state.onGround) {
          jumps = 1
          vel = 0
        } else {
          jumps = 0.5
          vel = state.vel + GRAVITY
        }
      }

      return {
        ...state, vel,
        move,
        right: move.x > 0 ? true : move.x < 0 ? false : state.right,
        animate: keyboard.x, //|| (move.y > GRAVITY),
        onGround: false,
        isGliding: false,
        velx: velx || state.velx - (state.velx - keyboard.x * SPEED) * DRAG,
        jumps
      }
    case c.BLOCKED:
      let newState = state

      if (action.dir.y) {
        //dispatch({ type: c.SPAWNPARTICLES, amt: 10, x: state.x, y: state.y - 50 })
        newState = { ...newState, vel: 0, move: { x: 0, y: 0 }, onGround: true }
      }
      if (action.dir.x) {
        //dispatch({ type: c.SPAWNPARTICLES, amt: 10, x: state.x, y: state.y - 50 })
        newState = { ...newState, vel: state.vel * 0.88, isGliding: true, force: action.dir.x }
      }

      return newState
    case COLLIDEWITH(c.SOLID):
      //console.log('collided with that guy ;)')

      return state
    default:
      return state
  }

  return state
}

const view = ({ state }) => {
  const { right, animate, onGround, move } = state
  const left = !right

  return <c x={state.x - 15} y={state.y}>
    <Animation frames={slice(juice, { width: 20, height: 20 })} scale={3} delay={100} conditions={[
      [!onGround && move.y > 0.2, [1, 2]],
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
