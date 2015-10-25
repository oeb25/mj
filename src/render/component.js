const component = (comp, props, ...children) => {

  const caller = comp.view ? comp.view : comp

  const c = typeof comp == 'string' ?
    [ comp, props, children ] :
    caller(props, children)

  if (!c) return false

  if (c[2].length) {
    if (typeof c[2][0][0] !== 'string') {
      return [ c[0], c[1], c[2][0] ]
    }
  }

  return c
}

export default component
