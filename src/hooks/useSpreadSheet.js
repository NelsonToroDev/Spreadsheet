import { useReducer } from 'react'

const getInitialState = (columns, rows) => {
  const cells = {
    cells: Array.from({ length: columns }, () =>
      Array.from({ length: rows }, () => ({ computedValue: 0, value: 0 }))
    )
  }

  return cells
}

const generateCode = (value) => {
  return `(() => {
    return ${value};
  })()`
}

const reducer = (state, action) => {
  const { type, payload } = action
  if (type === 'updateCell') {
    const cells = structuredClone(state.cells) // coned cells
    const { x, y, value } = payload
    const cell = cells[x][y]

    let computedValue
    try {
      // eslint-disable-next-line no-eval
      computedValue = eval(generateCode(value))
    } catch (e) {
      computedValue = `ERROR ${e.message}`
    }

    cell.value = value
    cell.computedValue = computedValue

    return { cells }
  }

  return state
}

export const useSpreadSheet = ({ columns, rows }) => {
  const [{ cells }, dispatch] = useReducer(
    reducer,
    getInitialState(columns, rows)
  )

  const updateCell = ({ x, y, value }) => {
    dispatch({ type: 'updateCell', payload: { x, y, value } })
  }

  return { cells, updateCell }
}
