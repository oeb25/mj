const e = a => typeof a == 'undefined'

const collideable = a => ({
  update(state, action) {
    const out = a.update(state, action)

    if (!out) return out

    if (e(out.x) || e(out.y) || e(out.width) || e(out.height)) {
      console.error('MISSING EITHER OF [x, y, width, height] ON CHILD', state, 'WITH TYPE', a)
    }

    return out
  },
  view: a.view
})

export const COLLIDEWITH = a => 'COLLIDE -> ' + a

export default collideable
