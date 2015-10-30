import { component } from './render'
import collideable, { COLLIDEWITH } from './collideable'
import physics from './physics'
import Animation from './Animation'
import texture from '../assets/box.png'
import juice from '../assets/juice.png'
import { slice } from './spritesheet'
import * as c from './constants'
import squez from '../assets/sfx/squez_1.ogg'
import Sound from './Sound'

const GRAVITY = 0.6
const JUMPINGPOWER = -16
const SPEED = 6
const DRAG = 0.2

const create = (x = 400, y = 100) => ({
  x, y,
  width: 30,
  height: 60,
  vel: 0,
  velx: 0,
  id: Math.random(),
  right: true,
  animate: false,
  move: { x: 0, y: 0 },
  jumpWasDown: false,
  onGround: false,
  isGliding: false,
  force: 0,
  jumps: 0,
  type: c.PLAYER,
  ignore: [c.PARTICLE]
})

const update = (state = create(), action) => {
  switch (action.type) {
    case c.TICK:
      const { keyboard } = action
      let actions = []

      let vel = state.vel
      let jumps = state.jumps

      let velx = 0

      if (state.isGliding && state.move.y > 1) {
        Sound.play('slide')
        actions.push({ type: c.SPAWNPARTICLES, x: state.x + (state.move.x > 0 ? state.width : 0), y: state.y + state.height / 2 })
      } else {
        Sound.stop('slide')
      }

      const hmmmmm = (keyboard.crouch ? 2 : 1)

      if (keyboard.jump && !state.jumpWasDown) {
        if (state.onGround && jumps > 0) {
          vel = JUMPINGPOWER
          Sound.play('suu')
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          jumps = jumps - 1
        } else {
          vel = state.vel + GRAVITY
        }

        if (state.isGliding && state.jumps > 0) {
          vel = JUMPINGPOWER
          Sound.play('suu')
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          actions.push({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          velx = state.force * JUMPINGPOWER * 1.5
          jumps = jumps - 1
        }
      } else {
        if (state.onGround) {
          jumps = 3
          vel = GRAVITY
        } else {
          vel = state.vel + hmmmmm * GRAVITY
        }
      }

      const move = {
        x: state.velx,
        y: vel
      }

      return [{
        ...state, vel,
        move,
        right: move.x > 0 ? true : move.x < 0 ? false : state.right,
        animate: keyboard.x, //|| (move.y > GRAVITY),
        jumpWasDown: keyboard.jump,
        onGround: false,
        isGliding: false,
        velx: velx || state.velx - (state.velx - keyboard.x * SPEED / hmmmmm) * DRAG,
        jumps,
        sit: keyboard.crouch
      }, actions]
    case c.BLOCKED:
      let newState = [state]

      if (action.dir.y) {
        //dispatch({ type: c.SPAWNPARTICLES, amt: 10, x: state.x, y: state.y - 50 })

        let plz = Math.max(Math.floor(state.move.y - 10), 0)

        if (plz > 0) {
          Sound.play('squez')
        }

        newState = [
          { ...newState[0], vel: GRAVITY, move: { x: 0, y: 0 }, onGround: true },
          plz > 0 ? new Array(plz).join('.').split('.').map(() =>
            ({ type: c.SPAWNPARTICLES, x: state.x + state.width / 2, y: state.y + state.height / 2 })
          ) : []

        ]
      } else if (action.dir.x) {
        //dispatch({ type: c.SPAWNPARTICLES, amt: 10, x: state.x, y: state.y - 50 })
        newState = [{
          ...newState[0],
          vel: state.move.y > 0 ? state.vel * 0.88 : state.vel,
          isGliding: true,
          force: action.dir.x
        }]
      }

      return newState
    case COLLIDEWITH(c.SOLID):
      //console.log('collided with that guy ;)')

      return [state]
    case c.INIT:
      console.log('creating player')

      return [{...state, x: action.x || state.x, y: action.y || state.y }]
    default:
      return [state]
  }

  return [state]
}

const view = ({ state }) => {
  const { right, animate, onGround, move } = state
  const left = !right

  let anim = (
    <Animation frames={slice(juice, { width: 20, height: 20 })} scale={3} delay={100} conditions={[
      [state.isGliding && move.y > 0, move.x > 0 ? [18, 2] : [16, 2]],

      [!onGround && move.y > 15.9, [12, 2]],
      [!onGround && move.y > 0.2, [14, 2]],
      [!onGround && move.y < 0.2, [1, 2]],
      // move right
      [state.sit && animate && right, [8, 4]],
      // move left
      [state.sit && animate && left, [4, 4]],
      // move right
      [animate && right, [4, 4]],
      // move left
      [animate && left, [8, 4]],
      [state.sit, [0, 20]],
      // right
      [right, [0, 1]],
      // left
      [left, [0, 1]]
    ]}/>
  )

  let stat = (<img src={juice} scale={0.14}/>)

  return <c x={state.x - 15} y={state.y}>
    {anim}
  </c>
}

const Player = collideable({ update, view })

export default Player
