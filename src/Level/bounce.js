const level = {
  spawn: [420, 70],

  solids: [
    [400, 600, 200, 100],
    [-100, 400, 100, 20],
    [500, 0, 100, 601],
  ],

  triggers: [
    [1100, 100, 50, 50, () => ({ type: 'LOAD', name: 'start' })]
  ]
}

export default level
