import start from './start'

const _levels = {
  start
}

const Levels = {
  load(name) {
    return _levels[name]
  }
}

export default Levels