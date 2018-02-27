import die from '../assets/sfx/die.ogg'
import slide_0 from '../assets/sfx/slide_0.mp3'
import slide_1 from '../assets/sfx/slide_1.ogg'
import squez_0 from '../assets/sfx/squez_0.mp3'
import squez_1 from '../assets/sfx/squez_1.ogg'
import squez_2 from '../assets/sfx/squez_2.ogg'
import squez_3 from '../assets/sfx/squez_3.ogg'
import suu_0 from '../assets/sfx/suu_0.mp3'
import suu_1 from '../assets/sfx/suu_1.ogg'
import suu_2 from '../assets/sfx/suu_2.ogg'
import suu_3 from '../assets/sfx/suu_3.ogg'

const PATH = '../asstes/sfx/'

const load = files => files.map(url => new Audio(url))

const sounds = {
  squez: load([
    squez_1,
    squez_2,
    squez_3,
    // squez_0
  ]),
  suu: load([
    suu_1,
    suu_2,
    suu_3,
    // suu_0,
  ]),
  slide: load([
    slide_0,
    // slide_1,
  ]),
  die: load([
    die,
  ])
}

let playing = []

export default {
  play(name, i) {
    const s = sounds[name]

    if (!s)
      return false

    if (Array.isArray(s)) {
        let sound
        if (typeof i !== 'undefined') {
          sound = s[i]
        } else {
          sound = s[Math.floor(Math.random() * s.length)]
        }

        if (sound) {
          let clear = () => {
            playing = playing.filter(a => a !== sound)
            sound.onended = void(0)
          }

          sound.play()

          playing.push(sound)

          //sound.onended = clear
        }
    }
  },

  stop(name) {
    if (sounds[name]) {
      sounds[name].map(s => { s.pause(); s.currentTime = 0 })
    }
  }
}
