export default function img(ctx, { stroke, width, height, color }, [ x, y ]) {
  if (stroke) {
    ctx.strokeStyle = color || 'black'
    ctx.strokeRect(x, y, width || 1, height || 1)
  } else {
    ctx.fillStyle = color || 'black'
    ctx.fillRect(x, y, width || 1, height || 1)
  }
}
