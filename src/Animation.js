import { component } from './render'
import Time from './Time'

const Animation = ({ frames, length = frames.length, conditions, delay = 100 }) => {
  if (!conditions)
    return Time({ reset: length * delay }, [t =>
      <img x={0} y={0} src={frames[Math.floor(t / delay)%length]}/>
    ])

  let [start, len] = conditions.filter(a => a[0])[0][1]

  return Animation({ frames: frames.slice(start, start + len), delay })
}

export default Animation
