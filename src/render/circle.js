const cache = {}

export default function circle(ctx, { scale = 1, color, radius, size = radius }, [ x, y ]) {
  ctx.fillStyle = color || 'black'
  ctx.beginPath()
  ctx.arc(x, y, Math.max(size, 0), 2 * Math.PI, false)
  ctx.fill()
}
