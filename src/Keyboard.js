import Tast, { KEYS } from 'tast'

const keyboard = new Tast().listen(window)

const controles = {
  right: [KEYS.D, KEYS.RIGHT],
  left: [KEYS.A, KEYS.LEFT],
  jump: [KEYS.W, KEYS.SPACE, KEYS.UP],
  up: [KEYS.W, KEYS.UP],
  down: [KEYS.S, KEYS.DOWN],
}

import Peer from 'peerjs'

let min = 111111
let max = 999999
let id = Math.floor(Math.random() * (max - min) + min)

export const listen = (cb) => {
  const peer = new Peer(id, { key: 'o455vp5n9epnwmi' })

  peer.on('open', id => {
    let onChange = cb(id)
    peer.on('connection', conn => conn.on('data', onChange))
  })
}

// reciver
listen(id => {
  controllerid.innerText = 'ID: ' + id

  return data => touch = data
})

let touch = { x: 0, y: 0, down: false }

const update = (last = keyboard.save()) => {
  const state = keyboard.save()

  return {
    ...state,
    last: last || {},
    down: a => state.down(a),
    up: a => state.up(a),
    x: touch.down ? touch.x : (state.down(controles.right) && 1) - (state.down(controles.left) && 1) || 0,
    y: touch.down ? touch.y : (state.down(controles.down) && 1) - (state.down(controles.up) && 1) || 0,
    //x: (state.down(controles.right) && 1) - (state.down(controles.left) && 1) || 0,
    //y: (state.down(controles.down) && 1) - (state.down(controles.up) && 1) || 0,
    jump: touch.amt > 1 || state.down(controles.jump) ? 1 : 0
  }
}

export default { update }
