import { useReducer } from 'react'
import { getColumn } from '../utils'

const getInitialState = (columns, rows) => {
  const cells = {
    cells: Array.from({ length: columns }, () =>
      Array.from({ length: rows }, () => ({ computedValue: 0, value: 0 }))
    )
  }

  return cells
}

const computeValue = (value, constants) => {
  if (!value.startsWith?.('=')) return value

  const valueToUse = value.substring(1)
  let computedValue
  try {
    // eslint-disable-next-line no-eval
    computedValue = eval(generateCode(valueToUse, constants))
  } catch (e) {
    computedValue = `ERROR ${e.message}`
  }
  return computedValue
}

const computeAllCell = (cells, constants) => {
  cells.forEach((rows, x) => {
    rows.forEach((cell, y) => {
      const computedValue = computeValue(cell.value, constants)
      cell.computedValue = computedValue
    })
  })
}

const generateCode = (value, constants) => {
  return `(() => {
    ${constants}
    return ${value};
  })()`
}

const generateCellsConstants = (cells) => {
  return cells
    .map((rows, x) => {
      return rows
        .map((cell, y) => {
          const letter = getColumn(x)
          const cellId = `${letter}${y}` // A5 B7
          return `const ${cellId} = ${cell.computedValue};`
        })
        .join('\n')
    })
    .join('\n')
}

const reducer = (state, action) => {
  const { type, payload } = action
  if (type === 'updateCell') {
    const cells = structuredClone(state.cells) // coned cells
    const { x, y, value } = payload
    const cell = cells[x][y]

    const constants = generateCellsConstants(cells)
    const computedValue = computeValue(value, constants)

    cell.value = value
    cell.computedValue = computedValue

    computeAllCell(cells, generateCellsConstants(cells))

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
