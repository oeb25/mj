import { component } from './render'
import collideable from './collideable'
import * as c from './constants'

const update = (state = { x: 0, y: 0, width: 32, height: 5, type: c.SOLID }) => state

const view = ({ state }) => {
  return <c>
    <rect {...state} color="gray" />
  </c>
}

export const create = (x = 0, y = 0, width = 32, height = 32) =>
  collideable({
    update(state = {x, y, width, height}) { return { ...update(void(0)), ...state } },
    view
  })

export default create()
