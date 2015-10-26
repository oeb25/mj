import Render, { component } from './render'

const TICK = 'TICK'

export default function run(App) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

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

      setTimeout(() => tick(), 1000/60)
    } catch(e) {
      console.timeEnd("WUHU!")
      console.error('Stopping game reason below!')
      throw e
    }
  }

  const render = () => {
    requestAnimationFrame(render)

    Render(<App state={state} dispatch={dispatch} />, ctx)
  }

  tick()
  render()
}
