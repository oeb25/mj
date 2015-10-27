const e = a => typeof a == 'undefined'

const collideable = a => ({
  update(state, action) {
    const out = a.update(state, action)

    if (!out) return out

    const [wuhu] = out

    if (e(wuhu.x) || e(wuhu.y) || e(wuhu.width) || e(wuhu.height)) {
      console.error('MISSING EITHER OF [x, y, width, height] ON CHILD', wuhu, 'WITH TYPE', a)
    }

    return out
  },
  view: a.view
})

export const COLLIDEWITH = a => 'COLLIDE -> ' + a

export default collideable
