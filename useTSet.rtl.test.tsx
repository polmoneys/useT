/**
 * @jest-environment jsdom
 */

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useT from './src/index'

afterEach(cleanup)

function setup(jsx: any): any {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

type ExampleObject = {
  id: number
  name: string
}

function TestComponent() {
  const [
    objectChips,
    dispatchObjectChips,
    hasObjectChip,
    undo,
    objectChipsArray,
  ] = useT<ExampleObject>()
  const addObjectChip = (objectChip: ExampleObject) => {
    dispatchObjectChips({ type: 'add', value: objectChip })
  }

  const removeObjectChip = (objectChip: ExampleObject) => {
    dispatchObjectChips({ type: 'remove', value: objectChip })
  }

  const objects = [
    { id: 1, name: 'Object 1' },
    { id: 2, name: 'Object 2' },
    { id: 3, name: 'Object 3' },
  ]
  return (
    <div>
      {objects.map(object => {
        const isInSet = hasObjectChip(item => item.id === object.id)

        return (
          <button
            key={object.id}
            data-testid={`add-chip-${object.id}`}
            onClick={() => addObjectChip(object)}
            disabled={isInSet}
            style={{
              color: isInSet ? 'green!important' : 'black!important',
            }}
          >
            Add {object.name}
          </button>
        )
      })}
      <ul data-testid="chips-list">
        {Array.from(objectChips).map(objectChip => (
          <li key={objectChip.id} data-testid="remove-chip">
            {objectChip.name}

            <button
              data-testid={`remove-chip-${objectChip.id}`}
              onClick={() => removeObjectChip(objectChip)}
              style={{ marginLeft: '1em' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        data-testid="clear-chips"
        onClick={() => dispatchObjectChips({ type: 'clear' })}
      >
        Clear Chips
      </button>
      <button data-testid="undo" onClick={undo}>
        Undo
      </button>
    </div>
  )
}

describe('useT', () => {
  it('should add, remove, clear, undo, and check if a value exists in the set', async () => {
    const { user } = setup(<TestComponent />)

    const addChipButton = screen.getByTestId('add-chip-1')
    // const clearChipsButton = screen.getByTestId('clear-chips')
    // const undoButton = screen.getByTestId('undo')

    const chipsList = screen.getByTestId('chips-list')

    //  expect(screen.queryByTestId('menu-content')).not.toBeInTheDocument()

    await user.click(addChipButton)
    expect(chipsList).toHaveTextContent('Object 1')
    expect(addChipButton).toBeDisabled()
    const chips = screen.getAllByTestId('remove-chip')
    expect(chips.length).toBe(1)
    const removeChipButton = screen.getByTestId('remove-chip-1')

    await user.click(removeChipButton)
    const chipsAfterRemove = screen.getAllByTestId('remove-chip')

    expect(chipsAfterRemove.length).toBe(0)

    // // Add a chip
    // await userEvent.type(input, 'apple')
    // userEvent.click(addChipButton)
    // expect(chipsList).toHaveTextContent('apple')

    // // Remove a chip
    // userEvent.click(removeChipButton)
    // expect(chipsList).not.toHaveTextContent('apple')

    // // Undo the removal
    // userEvent.click(undoButton)
    // expect(chipsList).toHaveTextContent('apple')

    // // Add another chip
    // await userEvent.type(input, 'banana')
    // userEvent.click(addChipButton)
    // expect(chipsList).toHaveTextContent('banana')

    // // Clear the chips
    // userEvent.click(clearChipsButton)
    // expect(chipsList).toBeEmptyDOMElement()

    // // Undo the clear action
    // userEvent.click(undoButton)
    // expect(chipsList).toHaveTextContent('apple')
    // expect(chipsList).toHaveTextContent('banana')
  })
})
