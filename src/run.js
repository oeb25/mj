import Render, { component } from './render'

const TICK = 'TICK'

export default function run(App) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.id = 'game'

  canvas.width = window.innerWidth || 800
  canvas.height = window.innerHeight || 600

  document.body.appendChild(canvas)

  let state

  const dispatch = action => {
    if (App.update)
      state = App.update(state, action)
  }

  dispatch({ type: 'INIT' })

  const tick = () => {
      try {
        dispatch({ type: TICK })

        setTimeout(() => tick(), 1000 / 60)
      } catch(e) {
        console.error('Stopping game reason below!')
        throw e
      }
  }

  let stop = false

  const render = () => {
    try {
      if (!stop)
        requestAnimationFrame(render)

      Render(<App state={state} dispatch={dispatch} />, ctx)
    } catch(e) {
      stop = true
      console.error('Render stopping game reason below!')
      throw e
    }
  }

  tick()
  render()
}
