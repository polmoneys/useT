import {
  type Dispatch,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react'

type State<T> = Set<T>

type Action<T> =
  | {
      type: 'add'
      value: T
    }
  | {
      type: 'remove'
      value: T
    }
  | {
      type: 'clear'
      value?: never
    }
  | {
      type: 'set'
      value: State<T>
    }

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  const { type } = action

  switch (type) {
    case 'add': {
      if (state.has(action.value)) {
        return state
      }
      return new Set(state).add(action.value)
    }
    case 'set': {
      return action.value
    }
    case 'remove': {
      const nextState = new Set(state)
      nextState.delete(action.value)
      return nextState
    }
    case 'clear': {
      return new Set()
    }
    default:
      return state
  }
}

interface useTProps<T> {
  initial?: T[]
}

const useT = <T>(
  props?: useTProps<T>,
): [
  State<T>,
  Dispatch<Action<T>>,
  (predicate: (value: T) => boolean) => boolean,
  () => void,
  T[],
] => {
  const [state, dispatch] = useReducer(
    reducer,
    new Set(props?.initial ?? []),
  ) as [State<T>, Dispatch<Action<T>>]

  const prevState = usePrevious(state)

  const hasValue = (predicate: (value: T) => boolean): boolean =>
    Array.from(state).some(predicate)
  const toArray = Array.from(state)

  const undo = useCallback(() => {
    if (prevState != null) {
      dispatch({ type: 'set', value: prevState })
    }
  }, [dispatch, prevState])

  return [state, dispatch, hasValue, undo, toArray]
}

export default useT

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
