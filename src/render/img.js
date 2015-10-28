const cache = {}

export default function img(ctx, { src, scale = 1 }, [ x, y ]) {
  if (!src) return

  if (typeof src == 'object')
    return ctx.drawImage(src, x, y, src.width * scale, src.height * scale)

  if (!cache[src]) {
    cache[src] = new Image()
    cache[src].src = src
  }
  const img = cache[src]

  ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
}
