import slicr from 'slicr'

let _cache = {}

export let slice = (file, ops) => {
  const id = JSON.stringify([file, ops])

  if (_cache[id])
    return _cache[id]

  _cache[id] = []

  slicr(file, ops).then(files =>
    _cache[id] = files
  )

  return _cache[id]
}

export default { slice }
