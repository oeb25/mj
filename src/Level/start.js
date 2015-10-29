const level = {
  spawn: [100, 70],

  solids: [
    [0, -520, 10, 700],
    [0, 150, 1000, 50],
    [1100, 100, 50, 50]
  ],

  triggers: [
    [1100, 100, 50, 50, () => ({ type: 'LOAD', name: 'start' })]
  ]
}

export default level
