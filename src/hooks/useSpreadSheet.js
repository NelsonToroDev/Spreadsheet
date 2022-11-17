import { useReducer } from 'react'

const getInitialState = (columns, rows) => {
  const cells = {
    cells: Array.from({
      length: columns
    },
    () => {
      return Array.from({ length: rows }, () => 0)
    })
  }

  return cells
}

const reducer = (state, action) => {
  const { type, payload } = action
  if (type === 'updateCell') {
    const cells = structuredClone(state.cells) // coned cells
    const { x, y, value } = payload
    cells[x][y] = value
    console.log({ value })
    return { cells }
  }

  return state
}

export const useSpreadSheet = ({ columns, rows }) => {
  const [{ cells }, dispatch] = useReducer(reducer, getInitialState(columns, rows))

  const updateCell = ({ x, y, value }) => {
    dispatch({ type: 'updateCell', payload: { x, y, value } })
  }

  console.log(cells)

  return { cells, updateCell }
}
