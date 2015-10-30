const PATH = '../asstes/sfx/'

const load = files => files.map(url => new Audio(url))

const sounds = {
  squez: load([
    require('../assets/sfx/squez_1.ogg'),
    require('../assets/sfx/squez_2.ogg'),
    require('../assets/sfx/squez_3.ogg'),
    // require('../assets/sfx/squez_0.mp3')
  ]),
  suu: load([
    require('../assets/sfx/suu_1.ogg'),
    require('../assets/sfx/suu_2.ogg'),
    require('../assets/sfx/suu_3.ogg'),
    // require('../assets/sfx/suu_0.mp3'),
  ]),
  slide: load([
    // require('../assets/sfx/slide_0.mp3'),
    require('../assets/sfx/slide_1.ogg'),
  ]),
  die: load([
    require('../assets/sfx/die.ogg'),
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
