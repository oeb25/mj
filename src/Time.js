import { component } from './render'

const Time = (s, children) => {
  const timer = Date.now() % ((s || {}).reset || (Math.PI / 180) * 36000)

  //console.log(timer);

  return children[0](timer)
}

export default Time
