// transition(["x", "y"], { update, view }) -> { update, view }

const TICK = 'TICK'

const transition = (props, mm) => {
  const create = () => {
    const target = mm.update(void(0), { type: 'INIT' })
    let current = {}

    props.map(a => current[a] = target[a])

    return { current, target }
  }

  const update = (state = create(), action) => {
    switch (action.type) {
      case TICK:
        const target = mm.update(void(0), action)
        let current = {}

        let a = 'x'

        //console.log(state.current[a] + (target[a] - state.current[a]) * 0.2);

        props.map(a => current[a] = state.current[a] + (target[a] - state.current[a]) * 0.2)

        return { current, target }
    }

    return state
  }

  const view = ({ state }, children) => {
    const extras = {}

    props.map(a => (state.current[a]))

    return mm.view({ state: state.current }, children)
  }

  return {view, update}
}


export default transition
