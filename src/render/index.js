import circle from './circle'
import component_ from './component'
import img from './img'
import rect from './rect'

const x = 0
const y = 1

const handlers = {
  img, rect, circle,
  c() {}
}

export default function Render(state, ctx) {
  const ops = []

  ops[x] = 0
  ops[y] = 0

  const p = false

  ctx['imageSmoothingEnabled'] = p;
  ctx['mozImageSmoothingEnabled'] = p;
  ctx['oImageSmoothingEnabled'] = p;
  ctx['webkitImageSmoothingEnabled'] = p;
  ctx['msImageSmoothingEnabled'] = p;

  const render = ops => thing => {
    const newOps = [
      ops[x] + (thing[1] ? (thing[1]['x'] || 0) : 0),
      ops[y] + (thing[1] ? (thing[1]['y'] || 0) : 0)
    ]

    handlers[thing[0]](ctx, thing[1], newOps)

    if (thing[2])
      thing[2].map(render(newOps))
  }

  ctx.fillStyle = '#77abea'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.width)
  ctx.fillStyle = 'black'

  render(ops)(state)
}

export const component = component_
