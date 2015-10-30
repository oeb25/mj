import start from './start'
import bounce from './bounce'

const _levels = {
  start,
  bounce
}

const Levels = {
  load(name) {
    return _levels[name]
  }
}

export default Levels