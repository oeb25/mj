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

let touch = { down: false, amt: 0, x: 0, y: 0 }

// reciver
listen(id => {
  controllerid.innerText = 'ID: ' + id

  return data => touch = data
})

setTimeout(() => {
  let size = 25

  const updateControlles = (data = {}) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!data.down)
      return touch = { down: false, amt: 0, x: 0, y: 0 }

    ctx.fillStyle = '#e1e1e1'
    ctx.beginPath()
    ctx.arc((start.x || canvas.width / 2), (start.y || canvas.height / 2), size, 2 * Math.PI, false)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = '#aeaeae'
    ctx.arc(data.x * size + (start.x || canvas.width / 2), data.y * size + (start.y || canvas.height / 2), 10, 2 * Math.PI, false)
    ctx.fill()

    touch = data
  }

  const canvas = document.createElement('canvas')
  //const canvas = document.getElementById('game')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  document.body.appendChild(canvas)

  canvas.id = 'controles'

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    updateControlles()

    window.scrollTo(0,1)
  })

  const ctx = canvas.getContext('2d')

  updateControlles()
  let start = {}
  let isDown = false

  const handler = down => e => {

    e.preventDefault()

    let t = e.touches[0] || { pageX: 0, pageY: 0 }

    if (e.touches.length == 1 && e.type == 'touchstart') {
      start = {
        x: t.pageX,
        y: t.pageY,
      }
    }

    const out = {
      x: t.pageX - start.x,
      y: t.pageY - start.y,
      down
    }

    const len = Math.sqrt(out.x * out.x + out.y * out.y)

    let hh = size

    updateControlles({
      x: (len > hh ? out.x / len * hh : out.x) / hh,
      y: (len > hh ? out.y / len * hh : out.y) / hh,
      down: !!e.touches.length,
      amt: e.touches.length
    })
  }

  canvas.addEventListener('touchstart', handler(true))
  canvas.addEventListener('touchmove', handler(true))
  canvas.addEventListener('touchend', handler(false))
}, 100)

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
